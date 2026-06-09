import os
import logging

# Tắt các cảnh báo hiển thị vô hại
os.environ["LITELLM_LOG"] = "ERROR"
logging.getLogger("LiteLLM").setLevel(logging.CRITICAL)

import json
import asyncio
import re
import aiohttp
from urllib.parse import urljoin, urlparse
from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from openai import AsyncOpenAI
from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig

load_dotenv()

# ==========================================
# 0. HÀM TẢI FILE VẬT LÝ
# ==========================================
async def download_file(url: str, dest_path: str) -> bool:
    if not url or not url.startswith('http'):
        return False
    clean_url = url.split('?')[0]
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(clean_url, timeout=30) as response:
                if response.status == 200:
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    with open(dest_path, 'wb') as f:
                        f.write(await response.read())
                    return True
    except Exception as e:
        print(f"      [LỖI TẢI ẢNH] {clean_url} -> {e}")
    return False

# ==========================================
# 1. DỌN RÁC HTML TOÀN CỤC & CHẶT KHÚC
# ==========================================
def clean_global_html(html_content: str) -> str:
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Ép xóa mạnh tay các thẻ cấu trúc rác và quảng cáo (AdSense)
    for tag in soup.find_all(['audio', 'video', 'iframe', 'header', 'nav', 'footer', 'aside', 'script', 'noscript', 'ins']):
        tag.decompose()
        
    # 2. Xóa các khối div chứa text quảng cáo dính kèm
    for ad_div in soup.find_all(lambda t: t.name == 'div' and t.string and 'Advertisements' in t.string):
        ad_div.decompose()
        
    # 3. Xóa player media cũ
    for mejs_div in soup.find_all('div', class_=re.compile(r'mejs-')):
        tag.decompose() if hasattr(tag, 'decompose') else mejs_div.decompose()
        
    return str(soup)
def split_html_into_parts(html_content: str) -> tuple[List[str], str]:
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. CÔ LẬP VÙNG NỘI DUNG CHÍNH (Tránh cắt nhầm chữ Part 1, 2 trên menu)
    main_content = soup.select_one('.entry-content') or soup.select_one('article') or soup.select_one('main') or soup.body
    if not main_content: main_content = soup
    
    content_str = str(main_content)

    # 2. CHẠY REGEX TRÊN VÙNG ĐÃ CÔ LẬP
    chunks = ["", "", "", ""]
    p2_match = re.search(r'(?i)<(?:h[1-6]|p|div|strong)[^>]*>.*?\bpart\s*2\b.*?</(?:h[1-6]|p|div|strong)>', content_str)
    p3_match = re.search(r'(?i)<(?:h[1-6]|p|div|strong)[^>]*>.*?\bpart\s*3\b.*?</(?:h[1-6]|p|div|strong)>', content_str)
    p4_match = re.search(r'(?i)<(?:h[1-6]|p|div|strong)[^>]*>.*?\bpart\s*4\b.*?</(?:h[1-6]|p|div|strong)>', content_str)
    
    idx2 = p2_match.start() if p2_match else len(content_str)
    idx3 = p3_match.start() if p3_match else len(content_str)
    idx4 = p4_match.start() if p4_match else len(content_str)
    idx_ans = len(content_str)

    # 3. TÌM VỊ TRÍ ANSWER KEY
    for kw in [r'answer\s*cam', r'answer\s*key', r'đáp\s*án', r'>\s*answers?\s*<', r'audioscript']:
        matches = list(re.finditer(r'(?i)' + kw, content_str))
        if matches and matches[-1].start() > idx4:
            idx_ans = matches[-1].start()
            break
            
    if idx_ans == len(content_str):
        idx_ans = int(len(content_str) * 0.8)

    # 4. TÁCH BẠCH HOÀN TOÀN (Không inject Answer Key ngược lại vào các part)
    answer_key_html = content_str[idx_ans:]
    
    chunks[0] = content_str[:idx2]
    chunks[1] = content_str[idx2:idx3]
    chunks[2] = content_str[idx3:idx4]
    chunks[3] = content_str[idx4:idx_ans]
    
    return chunks, answer_key_html

# ==========================================
# 2. XỬ LÝ HÌNH ẢNH VÀ MINIFY
# ==========================================
async def localize_assets_and_minify(raw_html: str, base_url: str, test_folder: str, part_num: int) -> str:
    if not raw_html: return ""
    soup = BeautifulSoup(raw_html, 'html.parser')
    
    target_node = soup.body if soup.body else soup

    media_dir = os.path.join(test_folder, "media")

    img_tags = target_node.find_all('img')
    for idx, img in enumerate(img_tags):
        src = img.get('src')
        if src:
            src_lower = src.lower()
            if 'artboard-194' in src_lower or 'logo' in src_lower:
                img.decompose()
                continue

            abs_url = urljoin(base_url, src)
            ext = os.path.splitext(urlparse(abs_url).path)[1] or '.jpg'
            filename = f"img_part{part_num}_{idx+1}{ext}"
            local_rel_path = f"media/{filename}"
            
            success = await download_file(abs_url, os.path.join(media_dir, filename))
            if success:
                img['src'] = local_rel_path 
            else:
                img.decompose()
                
    for tag in target_node.find_all(True):
        allowed_attrs = {}
        if tag.name == 'img' and tag.has_attr('src'):
            allowed_attrs['src'] = tag['src']
            if tag.has_attr('alt'): allowed_attrs['alt'] = tag['alt']
        tag.attrs = allowed_attrs
        
    for empty_tag in target_node.find_all(lambda tag: not tag.contents and tag.name not in ['br', 'img']):
        empty_tag.decompose()
        
    compact_html = re.sub(r'\n\s*\n', '\n', str(target_node)).strip()
    return compact_html

# ==========================================
# 3. SCHEMA DỮ LIỆU JSON
# ==========================================
class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    MATCHING = "MATCHING"
    PLAN_MAP_DIAGRAM_LABELLING = "PLAN_MAP_DIAGRAM_LABELLING"
    COMPLETION = "COMPLETION" 
    SHORT_ANSWER = "SHORT_ANSWER"

class Question(BaseModel):
    id: Optional[str] = None
    number: int
    text: str
    options: Optional[List[str]] = None 

class QuestionGroup(BaseModel):
    id: Optional[str] = None
    type: QuestionType
    instructions: str
    groupContentHTML: Optional[str] = None 
    sharedOptions: Optional[List[str]] = None 
    questions: List[Question]

class SinglePart(BaseModel):
    partNumber: int
    title: str
    audioPath: Optional[str] = None  
    questionGroups: List[QuestionGroup]

# ==========================================
# 4. LUỒNG XỬ LÝ CHÍNH
# ==========================================
async def process_test_by_parts(crawler: AsyncWebCrawler, test_name: str, test_url: str, api_token: str):
    match = re.search(r'(?i)cambridge.*?(\d+).*?test\s*(\d+)', test_name)
    cam_num = match.group(1) if match else "20"
    
    safe_test_name = test_name.replace(' ', '_')
    test_code_clean = safe_test_name.upper().replace('-', '_')
    test_folder = f"./{test_code_clean}"
    os.makedirs(test_folder, exist_ok=True)
    
    print(f"\n=============================================")
    print(f"Đang xử lý: {test_code_clean}")
    print(f"URL: {test_url}")
    print(f"=============================================")

    run_config_raw = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        magic=False, 
        delay_before_return_html=3.0,
        page_timeout=120000,
        excluded_tags=["script", "style", "nav", "footer", "aside", "header", "svg", "form", "button"],
        remove_overlay_elements=True
    )
    
    print("[1/3] Đang tải mã nguồn Test chính...")
    raw_result = await crawler.arun(url=test_url, config=run_config_raw)
    if not raw_result.success:
        print("   -> [THẤT BẠI] Không thể tải trang Test.")
        return

    cleaned_html = clean_global_html(raw_result.html)
    html_chunks, answer_key_html = split_html_into_parts(cleaned_html)

    with open(os.path.join(test_folder, f"PREPROCESSED_{test_code_clean}_AnswerKey.html"), "w", encoding="utf-8") as f:
        f.write(answer_key_html)
    
    print("[2/3] Nhờ AI phân tích và tải hình ảnh (4 Parts)...")
    backup_models = ["openai/gpt-4o-mini", "google/gemini-3.1-flash-lite-preview", "deepseek/deepseek-v4-pro"]
    all_parts = []
    client = AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_token)

    for i in range(1, 5):
        print(f"\n   --- Đang xử lý Part {i} ---")
        
        localized_chunk = await localize_assets_and_minify(html_chunks[i-1], test_url, test_folder, i)
        
        with open(os.path.join(test_folder, f"PREPROCESSED_{test_code_clean}_Part{i}.html"), "w", encoding="utf-8") as f:
            f.write(localized_chunk)
        
        instruction = f"""
        You are an expert IELTS data extractor parsing HTML chunk for PART NUMBER {i}. Output STRICT JSON matching the schema.

        CRITICAL RULES (FAILING THESE WILL BREAK THE FRONTEND):
        1. NO REASONING/THINKING IN VALUES: NEVER put your internal thoughts, reasoning, or notes (e.g., "Wait, let me check...", "(Duplicate for...)") inside any JSON string fields. Output ONLY the final cleaned text.
        2. PRESERVE HTML & GAPS: For COMPLETION types, keep all <table>, <ul>, <p>, <strong>, <img>. NEVER remove gap-fill characters (e.g., `.......`, `___`) as the frontend uses regex to render inputs!
        3. CLEAN TEXT: Remove question numbers (e.g., "25 ", "26 ") from the beginning of the `text` fields.

        STEP 1: CLASSIFY TYPE (Must be one of these exactly)
        - `MULTIPLE_CHOICE`: Keywords ("Choose TWO letters", "A, B or C") OR Structure (Question + A, B, C list).
        - `MATCHING`: Keywords ("answers from the box") OR Structure (Box of A-H options + list of items).
        - `COMPLETION`: Keywords ("Complete notes/table", "ONE WORD") OR Structure (gap-fill dots ".......").
        - `SHORT_ANSWER`: Keywords ("Answer questions") OR Structure (Direct questions ending with "?", NO gap-fill dots).
        - `PLAN_MAP_DIAGRAM_LABELLING`: Keywords ("Label map/plan").

        STEP 2: EXTRACT BY TYPE
        
        IF MULTIPLE_CHOICE (COMPOUND / MULTIPLE_ANSWER / TRUE_FALSE):
        [Condition]: The instruction says "Choose TWO/THREE letters", OR there are multiple question numbers (e.g. "Questions 11 and 12") sharing ONE single bank of A-E options.
        - sharedOptions: Put the shared A-E choices here AT ROOT LEVEL of QuestionGroup (e.g., ["A  the active lifestyle", "B  the above-average salaries"]). CRITICAL: MUST NOT BE NULL.
        - questions: Create one object for EACH question number (e.g., one for 11, one for 12).
        - text: Duplicate the exact same question text for both. NO reasoning notes.
        - options: CRITICAL: MUST BE NULL for all individual questions.
        - groupContentHTML: NULL.

        IF MULTIPLE_CHOICE (STANDARD):
        [Condition]: The instruction says "Choose the correct letter", AND each question number has its own separate A, B, C list below it.
        - sharedOptions: NULL.
        - groupContentHTML: NULL (DO NOT dump raw HTML here).
        - text: Question text ONLY. Remove the question number.
        - options: An ARRAY of strings containing the A, B, C choices for this specific question. CRITICAL: MUST NOT BE NULL.

        IF MATCHING:
        - sharedOptions: Extract the bank of A-H options into an array AT ROOT LEVEL.
        - groupContentHTML: NULL (DO NOT include the HTML box of A-H options, as it causes duplication).
        - text: The specific item being matched.
        - options: NULL.

        IF COMPLETION / PLAN_MAP_DIAGRAM_LABELLING:
        - groupContentHTML: ENTIRE HTML block (text, tables, images). MUST preserve <table> tags and ALL gap-fill dots/underscores (`.......`, `___`).
        - questions: CRITICAL: You MUST create an object for EVERY question number found (e.g. 31, 32).
        - text: "".
        - options: NULL.
        - sharedOptions: NULL.

        IF SHORT_ANSWER:
        - groupContentHTML: Instruction text (e.g., "NO MORE THAN TWO WORDS").
        - text: The direct question text. MUST NOT contain gap-fill dots.
        - options: NULL.
        - sharedOptions: NULL.
        """

        part_success = False
        for model_id in backup_models:
            print(f"      -> Đang gọi AI: {model_id}")
            try:
                response = await client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": instruction},
                        {"role": "user", "content": f"Extract data from this HTML chunk:\n\n{localized_chunk}"}
                    ],
                    response_format={"type": "json_schema", "json_schema": {"name": "single_part_schema", "schema": SinglePart.model_json_schema(), "strict": True}},
                    temperature=0.0
                )

                raw_json_str = response.choices[0].message.content
                part_data = json.loads(raw_json_str)
                if isinstance(part_data, list): part_data = part_data[0]
                
                if not part_data.get("questionGroups"):
                    print(f"      -> [CẢNH BÁO] AI không cào câu hỏi. Thử lại...")
                    continue 

                file_extension = ".m4a" if str(cam_num) == "19" else ".mp3"
                part_data["audioPath"] = f"media/audio_part{i}{file_extension}"
                    
                all_parts.append(part_data)
                print(f"      -> [OK] Trích xuất Part {i} thành công.")
                part_success = True
                break 

            except json.JSONDecodeError: print(f"      -> [LỖI JSON] Thử model khác...")
            except Exception as e: print(f"      -> [LỖI API] {e}. Thử model khác...")
                
            await asyncio.sleep(2)

        if not part_success: print(f"      -> [THẤT BẠI] Không thể bóc tách Part {i}.")
        if i < 4: await asyncio.sleep(2)

    for part in all_parts:
        p_num = part.get("partNumber", 1)
        for g_idx, group in enumerate(part.get("questionGroups", []), start=1):
            group["id"] = f"qg_{test_code_clean}_p{p_num}_{g_idx}"
            
            # --- PYTHON DATA SANITIZATION ---
            group_type = group.get("type")
            
            if group_type == "MATCHING":
                group["groupContentHTML"] = None
                
            elif group_type == "MULTIPLE_CHOICE":
                if group.get("sharedOptions") and len(group["sharedOptions"]) > 0:
                    for q in group.get("questions", []):
                        q["options"] = None
                else:
                    if group.get("groupContentHTML") and not "<img" in group["groupContentHTML"]:
                        group["groupContentHTML"] = None
                        
            elif group_type in ["COMPLETION", "PLAN_MAP_DIAGRAM_LABELLING"]:
                # Fallback: Tự động trích xuất questions nếu AI quên
                if not group.get("questions") and group.get("groupContentHTML"):
                    html_text = group["groupContentHTML"]
                    # Loại bỏ HTML tag để tìm số + khoảng trống dễ hơn
                    plain_text = re.sub(r'<[^>]+>', ' ', html_text)
                    # Tìm số đứng trước dải dấu chấm hoặc gạch dưới (VD: "31 .......")
                    matches = re.findall(r'(?<!\d)(\d+)\s*(?:_{2,}|\.{2,}|\u2026+)', plain_text)
                    
                    # Nếu cách trên không tìm thấy, thử tìm số nằm trong thẻ strong/b
                    if not matches:
                        matches = re.findall(r'<(?:strong|b)[^>]*>\s*(\d+)\s*</(?:strong|b)>', html_text)
                        
                    if matches:
                        seen = set()
                        unique_nums = [int(m) for m in matches if not (m in seen or seen.add(m))]
                        group["questions"] = [{"number": num, "text": "", "options": None} for num in unique_nums]
                        print(f"      -> [PHỤC HỒI] Đã tự động tạo {len(unique_nums)} câu hỏi cho COMPLETION.")

            # 2. Làm sạch text của từng câu hỏi
            for q in group.get("questions", []):
                q["id"] = f"q_{test_code_clean}_{q.get('number', 0)}"
                raw_text = q.get("text", "")
                if raw_text:
                    # Xoá số thứ tự ở đầu câu (VD: "25 ", "25. ")
                    clean_text = re.sub(r'^\d+[\.\)\s]+', '', raw_text)
                    # Xoá các câu suy luận nhảm của AI (nếu có)
                    clean_text = re.sub(r'(?i)\(?duplicate for.*?\)?', '', clean_text)
                    clean_text = re.sub(r'(?i)\(duplicate.*?\)', '', clean_text)
                    clean_text = re.sub(r'(?i)wait[, ].*', '', clean_text)
                    clean_text = re.sub(r'(?i)as per schema.*', '', clean_text)
                    q["text"] = clean_text.strip()

    print("\n[3/3] Đang bóc tách Answer Key...")
    ans_instruction = """
    Extract the official answer key from this HTML.
    Return ONLY a JSON dictionary where keys are question numbers (string) and values are lists of string answers.
    Split compound answers (e.g., "25&26 B, D" -> "25": ["B", "D"], "26": ["B", "D"]).
    """
    
    global_answers = {}
    try:
        ans_response = await client.chat.completions.create(
            model=backup_models[0],
            messages=[
                {"role": "system", "content": ans_instruction},
                {"role": "user", "content": answer_key_html}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        parsed_ans = json.loads(ans_response.choices[0].message.content)
        global_answers = {k: parsed_ans[k] for k in sorted(parsed_ans.keys(), key=lambda x: int(x) if x.isdigit() else 999)}
        print("   -> [OK] Trích xuất Answer Key thành công.")
    except Exception as e:
        print(f"   -> [THẤT BẠI] Lỗi xử lý Answer Key: {e}")

    final_json = {
        "id": f"test_{test_code_clean.lower()}",
        "testCode": test_code_clean,
        "title": test_name,
        "parts": all_parts,
        "answers": global_answers 
    }

    test_file = os.path.join(test_folder, f"{test_code_clean}_ListeningData.json")
    with open(test_file, "w", encoding="utf-8") as f:
        json.dump(final_json, f, ensure_ascii=False, indent=2)
        
    print(f"\n-> [HOÀN TẤT] Dữ liệu JSON đã được lưu trong thư mục: {test_folder}/")

# ==========================================
# 5. MAIN
# ==========================================
async def main():
    api_token = os.getenv("OPENROUTER_API_KEY")
    if not api_token: 
        print("Thiếu OPENROUTER_API_KEY trong file .env")
        return

    with open("ielts_listening_links.json", "r", encoding="utf-8") as f:
        tests = json.load(f).get("tests", [])

    tests_to_crawl = tests[2:3] 
    
    browser_config = BrowserConfig(headless=True, verbose=True)
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for test in tests_to_crawl:
            await process_test_by_parts(
                crawler, 
                test["test_name"], 
                test["test_url"], 
                api_token
            )

if __name__ == "__main__":
    asyncio.run(main())