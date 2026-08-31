# IELTS Computer Simulator — Production Build Plan

> Living document: đây là nguồn tham chiếu chính trong suốt quá trình nâng cấp project.
> Mỗi task hoàn thành phải cập nhật trạng thái, bằng chứng kiểm thử và Progress Log trong file này.

## 1. Mục tiêu

Nâng IELTS Computer Simulator từ MVP thành một hệ thống:

- An toàn và đáng tin cậy cho user thật.
- Có kiến trúc backend rõ ràng, dễ mở rộng và dễ kiểm thử.
- Có quy trình deploy lặp lại được trên Vercel và Google Cloud Run.
- Thể hiện tư duy engineering tốt trong mắt nhà tuyển dụng.
- Giúp người xây project hiểu bản chất backend, không chỉ sao chép code.

## 2. Nguyên tắc làm việc

1. Hỏi ý kiến owner trước khi bắt đầu implement một task mới.
2. Trước mỗi task, liệt kê rõ các feature/file dự kiến thay đổi.
3. Làm lần lượt theo mức độ rủi ro; không ưu tiên AI trước nền tảng bảo mật.
4. Mỗi thay đổi phải có cách kiểm chứng tương xứng với rủi ro.
5. Không đưa secret vào Git, log hoặc response.
6. Database schema production chỉ thay đổi bằng migration đã commit.
7. Backend là nguồn sự thật cho quyền truy cập, đáp án và điểm số.
8. Không đánh dấu task hoàn thành nếu chưa đạt acceptance criteria.
9. Không sửa unrelated code hoặc ghi đè thay đổi đang có của owner.
10. Mọi quyết định kiến trúc quan trọng phải được ghi vào Decision Log.

## 3. Cách sử dụng file này

Trạng thái task:

- `[ ]` Chưa bắt đầu.
- `[~]` Đang thực hiện.
- `[x]` Hoàn thành và đã kiểm chứng.
- `[!]` Bị chặn; lý do phải được ghi trong Progress Log.

Quy trình cho mỗi task:

1. Đọc mục `Backend knowledge` của task.
2. Audit code liên quan.
3. Trình bày feature và phương án cho owner duyệt.
4. Đổi trạng thái thành `[~]`.
5. Implement theo phạm vi đã duyệt.
6. Chạy lint, typecheck, test hoặc build phù hợp.
7. Ghi bằng chứng kiểm thử.
8. Đổi trạng thái thành `[x]` và cập nhật Progress Log.

## 4. Baseline hiện tại

### Kiến trúc

- Frontend: Next.js App Router, React, Tailwind CSS, Zustand.
- Backend: NestJS REST API.
- Auth: Supabase Auth; frontend chuyển access token bằng Bearer header.
- Database: Supabase PostgreSQL.
- ORM: Prisma ở backend.
- Deployment: Vercel cho frontend, Google Cloud Run cho backend container.

### Điểm tốt

- Frontend và backend đã được tách thành hai application.
- Database access chính đã chuyển về NestJS.
- Protected API lấy user ID từ JWT.
- User sync đã dùng `upsert` theo Supabase user ID.
- Attempt detail đã kiểm tra ownership.
- JSONB phù hợp với cấu trúc đề IELTS đa dạng ở giai đoạn hiện tại.

### Rủi ro đã phát hiện

- Backend đang nhận và lưu `score` do frontend gửi lên.
- Public test payload có nguy cơ chứa answer key.
- Request body chưa có runtime DTO validation.
- JWT secret có fallback khi thiếu env.
- CORS đang mở toàn bộ origin.
- Chưa có Prisma migration history.
- User sync lỗi có thể bị bỏ qua.
- API client và error handling phía frontend bị lặp.
- Test hiện tại gần như chỉ là NestJS starter test.
- README và package versions không đồng nhất.
- `frontend/scratch/check-db.ts` vẫn tham chiếu Prisma.
- Keep-alive workflow và Next.js route đang query hai bảng khác nhau.

## 5. Definition of Done toàn project

Project được xem là production-ready phiên bản đầu khi:

- User không thể tự khai điểm hoặc tải answer key trước khi submit.
- API từ chối payload sai và không nhận field thừa.
- Backend không khởi động nếu thiếu env bắt buộc.
- CORS chỉ cho phép origin đã cấu hình.
- User sync idempotent và có test cho email/password lẫn Google OAuth.
- Database có migration history và quy trình `migrate deploy`.
- Critical journey có automated E2E test.
- CI chạy lint, typecheck, tests và build.
- Có health check, structured logs và error monitoring.
- Deployment có thể tái lập mà không build lại trong startup command.
- Root README mô tả đúng kiến trúc thực tế và có demo/diagram.

---

# PHASE 0 — Baseline và project hygiene

## P0.1 — Reproducible local setup

**Status:** `[x]`

### Features

- Root workspace scripts cho frontend và backend.
- `.env.example` riêng cho hai application.
- Tài liệu setup local từ repository sạch.
- Quy định Node version.
- Xác định rõ package manager và lockfile strategy.

### Backend knowledge

- Môi trường chạy là một phần của hệ thống, không chỉ là việc cài dependencies.
- Reproducibility nghĩa là hai developer có thể tạo cùng một build từ cùng source.
- `npm ci` dùng lockfile nghiêm ngặt hơn `npm install`, phù hợp CI.

### Acceptance criteria

- Một developer mới có thể chạy cả hai app chỉ bằng README.
- Không cần đoán tên env variable.
- Secret thật không xuất hiện trong repository.
- Frontend và backend build thành công với Node version đã công bố.

### Verification

- Cài dependencies từ lockfile.
- Chạy frontend build.
- Chạy backend build.
- Kiểm tra Git không track env file.

## P0.2 — Remove stale architecture artifacts

**Status:** `[ ]`

### Features

- Xử lý hoặc xóa scratch code dùng Prisma trong frontend.
- Đồng bộ README với Next.js/React/NestJS thực tế.
- Thay backend starter README.
- Thống nhất keep-alive/health strategy.

### Backend knowledge

- Dead code tạo ra “false architecture”: code chạy một kiểu nhưng repository kể câu chuyện khác.
- Documentation drift là một dạng technical debt.

### Acceptance criteria

- Không còn Prisma dependency/import trong frontend production tree.
- README không tuyên bố version hoặc kiến trúc sai.
- Chỉ có một chiến lược health/keep-alive được ghi nhận.

---

# PHASE 1 — Production safety

## P1.1 — Environment validation và secure bootstrap

**Status:** `[ ]`

### Features

- Khai báo schema cho env bắt buộc.
- Backend fail fast nếu thiếu `DATABASE_URL`, auth config hoặc allowed origins.
- Xóa JWT fallback secret.
- Phân tách development, test và production config.
- Không lộ giá trị secret trong error message.

### Backend knowledge

- **Configuration boundary:** env là input không đáng tin giống request body.
- **Fail fast:** dừng lúc startup tốt hơn chạy sai âm thầm rồi lỗi khi có user.
- **Secret management:** secret phải được inject từ deployment platform, không commit.
- **Twelve-factor config:** config thay đổi theo môi trường, code thì không.

### Acceptance criteria

- Backend từ chối khởi động khi thiếu env bắt buộc.
- Không còn secret mặc định.
- Có unit test hoặc config test cho env hợp lệ/không hợp lệ.

### Verification

- Start backend với env hợp lệ.
- Start backend sau khi cố ý thiếu từng env quan trọng và xác nhận lỗi rõ ràng.

## P1.2 — DTO và global request validation

**Status:** `[ ]`

### Features

- Global `ValidationPipe`.
- DTO cho update profile, create comment, create/submit attempt và query params.
- Whitelist field; từ chối field không được khai báo.
- Validate length, number range, enum, URL và nested answers.
- Response lỗi validation nhất quán.

### Backend knowledge

- TypeScript chỉ kiểm tra lúc compile; JSON từ internet không có type ở runtime.
- DTO định nghĩa contract tại ranh giới hệ thống.
- `whitelist` loại field lạ; `forbidNonWhitelisted` giúp phát hiện client sai contract.
- Validation không thay thế authorization hay business rules.

### Acceptance criteria

- `score: "forty"`, thời gian âm, comment rỗng và field lạ đều bị từ chối.
- Payload hợp lệ vẫn hoạt động.
- Controller không còn nhận `any` cho public input.

### Verification

- Unit test DTO quan trọng.
- E2E test status `400` cho payload sai.

## P1.3 — CORS và HTTP hardening

**Status:** `[ ]`

### Features

- CORS whitelist theo env.
- Security headers.
- Request payload limit.
- API prefix `/api/v1`.
- Global exception response không làm lộ stack trace production.

### Backend knowledge

- CORS là chính sách của browser, không phải cơ chế authorization.
- Security headers giảm một số lớp tấn công phía browser.
- Versioned API giúp thay đổi contract mà không phá client cũ ngay lập tức.

### Acceptance criteria

- Origin production hợp lệ gọi được API.
- Origin không nằm trong allowlist bị browser policy chặn.
- Error production không trả stack trace.

## P1.4 — Server-side grading và answer-key protection

**Status:** `[ ]`

### Features

- Frontend chỉ gửi answers và metadata cần thiết.
- Backend tải answer key và tự tính điểm.
- Public test response không chứa đáp án.
- Grading engine là pure function, có unit test.
- Lưu grading snapshot/version trong attempt.
- Chuẩn hóa alternate answers, whitespace và case theo rule được duyệt.

### Backend knowledge

- **Trust boundary:** mọi dữ liệu từ client đều có thể bị sửa bằng DevTools hoặc HTTP client.
- **Server authority:** dữ liệu có giá trị như điểm, giá tiền và quyền phải do server quyết định.
- **Pure function:** grading tách khỏi database sẽ dễ kiểm thử và tái sử dụng.
- **Snapshot:** lịch sử kết quả không nên tự đổi khi đề hoặc rubric được cập nhật.

### Acceptance criteria

- Client không thể gửi trực tiếp score để được lưu.
- Network response trước submit không có answer key.
- Grading tests bao phủ alternate answer và các question type đang hỗ trợ.
- Attempt lưu đủ dữ liệu để audit kết quả.

### Verification

- Gọi API thủ công với field `score: 40`; API phải từ chối hoặc bỏ field.
- Kiểm tra payload của endpoint lấy đề.
- Chạy grading unit tests.

## P1.5 — Reliable user provisioning/sync

**Status:** `[ ]`

### Features

- User sync idempotent.
- Cập nhật metadata có kiểm soát.
- Xử lý rõ ràng khi sync thất bại.
- Đảm bảo authenticated user tồn tại trước thao tác có foreign key.
- Test email/password và Google OAuth metadata.
- Logging cho sync failure không chứa token.

### Backend knowledge

- **Idempotency:** gọi cùng operation nhiều lần vẫn tạo một kết quả hợp lệ duy nhất.
- OAuth callback có thể retry hoặc chạy lại; đây là hành vi bình thường.
- Auth identity và application profile là hai nguồn dữ liệu khác nhau.
- Database unique constraint là lớp bảo vệ cuối, không phải toàn bộ workflow.

### Acceptance criteria

- Gọi `/users/sync` nhiều lần không tạo duplicate.
- User có thể tạo attempt/comment ngay sau lần đăng nhập đầu.
- Sync failure không bị biến thành trạng thái thành công im lặng.

## P1.6 — Prisma migrations và data safety

**Status:** `[ ]`

### Features

- Tạo migration baseline hợp lệ.
- Dùng `migrate dev` ở development và `migrate deploy` trong release.
- Index cho query attempts/comments phổ biến.
- Enum cho test type, attempt mode/status khi phù hợp.
- Tài liệu backup và restore.

### Backend knowledge

- Schema là trạng thái mong muốn; migration là lịch sử biến đổi có thứ tự.
- `db push` tiện cho prototype nhưng không phải deployment history an toàn.
- Index tăng tốc đọc nhưng làm tăng chi phí ghi và storage.
- Migration data cần được thiết kế khác migration schema đơn giản.

### Acceptance criteria

- Database mới có thể được dựng hoàn toàn từ migrations.
- Database hiện tại có đường baseline/migrate rõ ràng.
- Production deployment không dùng `db push`.

---

# PHASE 2 — Reliability và maintainability

## P2.1 — Centralized frontend API client

**Status:** `[ ]`

### Features

- Một nơi quản lý base URL, auth header, timeout và error parsing.
- Typed success/error result.
- Phân biệt empty data, unauthorized, validation error và backend unavailable.
- Không lặp fetch boilerplate trong actions/pages.

### Backend knowledge

- API client là adapter giữa frontend domain và transport HTTP.
- Timeout cần thiết vì network request có thể không bao giờ hoàn thành như kỳ vọng.
- Retry không phù hợp cho mọi request; POST không idempotent có thể tạo duplicate.

### Acceptance criteria

- Không còn lặp logic token/header/error parsing ở nhiều file.
- UI hiển thị đúng empty state và error state.

## P2.2 — OpenAPI và contract safety

**Status:** `[ ]`

### Features

- Swagger/OpenAPI cho NestJS.
- Mô tả auth, DTO, response và error.
- Generate hoặc validate frontend types từ API schema.
- Contract check trong CI.

### Backend knowledge

- API contract là cam kết giữa client và server.
- Compile thành công ở hai repository/module không đảm bảo chúng nói cùng một protocol.
- Generated clients giảm type drift nhưng vẫn cần business tests.

### Acceptance criteria

- API docs mở được ở development/staging.
- Frontend build lỗi khi contract quan trọng bị thay đổi không tương thích.

## P2.3 — Automated test pyramid

**Status:** `[ ]`

### Features

- Unit test grading và business rules.
- Integration test Prisma/services với test database.
- Authorization tests.
- E2E critical journey.
- Frontend tests cho timer, answer persistence và result view.

### Backend knowledge

- Unit test nhanh và cô lập; integration test kiểm tra các component hợp tác; E2E kiểm tra hành trình thật.
- Test authorization nên chứng minh user A không đọc/sửa dữ liệu user B.
- Coverage là tín hiệu phụ; test đúng rủi ro business mới là mục tiêu.

### Critical test cases

- User sync được gọi hai lần.
- Submit attempt với payload sai.
- User A yêu cầu attempt của user B.
- Grading alternate answers.
- Comment rỗng/quá dài.
- Backend/database unavailable được hiển thị đúng ở frontend.

### Acceptance criteria

- Critical backend tests chạy ổn định trong CI.
- Không dùng production database cho automated tests.

## P2.4 — Health, logging và observability

**Status:** `[ ]`

### Features

- `/health/live` và `/health/ready`.
- Structured JSON logging.
- Request/correlation ID.
- Error monitoring.
- Metric tối thiểu cho latency, error rate và dependency failures.

### Backend knowledge

- Liveness trả lời “process còn sống không?”.
- Readiness trả lời “instance có sẵn sàng nhận traffic không?”.
- Logs mô tả event; metrics mô tả xu hướng; traces mô tả một request đi qua hệ thống.
- Correlation ID nối log của cùng một request.

### Acceptance criteria

- Deployment platform có health endpoint phù hợp.
- Có thể lần theo một request lỗi mà không cần token/user PII.
- Database outage thể hiện rõ trong readiness/monitoring.

## P2.5 — Rate limiting và abuse protection

**Status:** `[ ]`

### Features

- Rate limit cho comment, submit attempt và AI endpoints tương lai.
- Giới hạn kích thước upload/avatar.
- Comment moderation/reporting nền tảng.
- Quy tắc chống spam tối thiểu.

### Backend knowledge

- Authentication trả lời “ai”; authorization trả lời “được làm gì”; rate limit trả lời “được làm bao nhiêu lần”.
- Rate limit theo IP có hạn chế khi user dùng NAT/proxy; authenticated identity thường hữu ích hơn.

### Acceptance criteria

- Request vượt ngưỡng nhận response chuẩn và không làm backend quá tải.
- Limit có thể cấu hình theo environment.

## P2.6 — CI/CD và deploy reproducibly

**Status:** `[ ]`

### Features

- CI: install → lint → typecheck → test → build.
- Build artifact hoặc Docker image bất biến.
- Migration chạy ở release phase.
- Runtime chỉ start artifact đã build.
- Staging smoke test trước production.
- Rollback procedure.

### Backend knowledge

- CI kiểm tra source; CD đưa artifact đã kiểm tra tới môi trường.
- “Build once, run the same artifact” giảm khác biệt staging/production.
- Migration cần tương thích với version cũ trong lúc rolling deployment nếu có nhiều instance.

### Acceptance criteria

- Startup command không chạy `npm install` hoặc build.
- Failed test/build ngăn deployment.
- Có hướng dẫn rollback application và xử lý migration.

---

# PHASE 3 — Product quality

## P3.1 — Attempt lifecycle và autosave

**Status:** `[ ]`

### Features

- Attempt status: `IN_PROGRESS`, `SUBMITTED`, `GRADED`, `ABANDONED`.
- Start attempt trước khi làm bài.
- Autosave answers có debounce.
- Resume unfinished attempt.
- Submit idempotent để tránh double-click tạo nhiều kết quả.

### Backend knowledge

- Một record thường có lifecycle, không chỉ create/read.
- State machine ngăn transition vô nghĩa như submit lại attempt đã graded.
- Optimistic concurrency/version field giúp tránh ghi đè dữ liệu mới bằng request cũ.

## P3.2 — Analytics dashboard

**Status:** `[ ]`

### Features

- Lịch sử band score.
- Accuracy theo question type.
- Thời gian trung bình theo section.
- Weak-area insights.
- Pagination/filtering.

### Backend knowledge

- Transactional query và analytical query có nhu cầu khác nhau.
- Không nên tải toàn bộ lịch sử rồi aggregate ở browser khi dữ liệu tăng.
- Cần index dựa trên access pattern thực tế.

## P3.3 — Admin test management

**Status:** `[ ]`

### Features

- Role-based admin authorization.
- Draft/publish/archive test.
- Validate content schema khi import.
- Version test và answer key.
- Audit log thay đổi quan trọng.

### Backend knowledge

- Không kiểm tra admin bằng UI; backend phải enforce role.
- RBAC gán quyền theo vai trò; resource ownership là một lớp authorization khác.
- Audit log khác application log: audit log hướng đến truy cứu ai đã thay đổi cái gì.

## P3.4 — Comment safety

**Status:** `[ ]`

### Features

- Edit/delete comment có ownership check.
- Report và moderation state.
- Pagination.
- Sanitize/render content an toàn.

### Backend knowledge

- Stored XSS có thể xảy ra khi nội dung user được lưu rồi render cho nhiều người.
- Validation, sanitization và output encoding giải quyết các phần khác nhau của vấn đề.

---

# PHASE 4 — AI grading

## P4.1 — AI architecture foundation

**Status:** `[ ]`

### Features

- Provider abstraction cho OpenAI/Gemini.
- Async grading job.
- Retry với backoff, timeout và dead-letter handling.
- Usage quota, rate limit và cost tracking.
- Lưu model, prompt, rubric và output version.

### Backend knowledge

- External AI API là dependency chậm, tốn tiền và có thể thất bại.
- Job queue tách request của user khỏi công việc dài.
- Retry cần idempotency; nếu không có thể tính phí hoặc ghi kết quả nhiều lần.
- Provider abstraction chỉ đáng dùng khi ranh giới thực sự ổn định và có test.

## P4.2 — Writing grading

**Status:** `[ ]`

### Features

- Chấm theo bốn tiêu chí IELTS Writing.
- Structured output có schema.
- Evidence và suggestion cụ thể.
- Overall band cùng confidence/limitations.
- Evaluation dataset và regression tests.

### Acceptance criteria

- Output parse được ổn định.
- Không quảng bá AI score như kết quả IELTS chính thức.
- Model/prompt update phải chạy evaluation trước release.

## P4.3 — Speaking grading

**Status:** `[ ]`

### Features

- Upload/record audio an toàn.
- Async transcription.
- Chấm theo rubric Speaking.
- Retention/deletion policy cho audio.
- Trạng thái processing và retry UI.

### Backend knowledge

- Audio là dữ liệu cá nhân; cần lifecycle, access control và retention policy.
- Signed URL an toàn hơn public bucket cho nội dung riêng tư.

---

# 6. Backend learning curriculum gắn với roadmap

## Lesson 1 — Request lifecycle và trust boundary

Học khi làm: `P1.2`, `P1.3`, `P1.4`.

Một request đi qua các lớp:

```text
Browser
  -> HTTP/CORS
  -> Authentication guard
  -> Validation pipe
  -> Controller
  -> Service/business rules
  -> Prisma
  -> PostgreSQL constraints
  -> Response serializer
```

Mỗi lớp có một trách nhiệm:

- Guard xác định danh tính.
- Validation kiểm tra hình dạng dữ liệu.
- Controller chuyển HTTP request thành lời gọi use case.
- Service giữ business rules.
- Database giữ tính toàn vẹn cuối cùng.
- Serializer kiểm soát dữ liệu được trả ra.

Điểm quan trọng: dữ liệu đã qua authentication vẫn không tự động đáng tin. Một user đăng nhập hợp lệ vẫn có thể gửi `score: 40`, sửa `userId`, gửi comment quá dài hoặc đọc tài nguyên của người khác.

## Lesson 2 — Authentication và authorization

Học khi làm: `P1.5`, `P2.3`, `P3.3`.

- Authentication: token này thuộc về ai?
- Authorization: người đó có được thực hiện hành động này trên tài nguyên này không?
- Ownership: attempt/comment có thuộc user hiện tại không?
- Role: user có phải admin không?

Không nhận `userId` từ client cho thao tác cá nhân. Luôn lấy subject từ token và filter ownership ngay trong database query khi có thể.

## Lesson 3 — Validation và business invariants

Học khi làm: `P1.2`, `P1.4`.

Ví dụ:

- DTO rule: `timeTakenSeconds` phải là integer không âm.
- Business rule: user không thể submit một attempt đã `GRADED`.
- Database invariant: `User.email` là unique.

Ba loại rule này nên đặt ở đúng lớp. Không dồn mọi thứ vào controller hoặc database.

## Lesson 4 — Database, transaction và migration

Học khi làm: `P1.5`, `P1.6`, `P3.1`.

- Transaction giúp nhiều thay đổi thành công hoặc rollback như một đơn vị.
- Unique constraint bảo vệ race condition tốt hơn check-then-create đơn thuần.
- Migration mô tả cách database thay đổi theo thời gian.
- Index được thiết kế từ query pattern, không thêm tùy ý.

## Lesson 5 — Idempotency và distributed failure

Học khi làm: `P1.5`, `P3.1`, `P4.1`.

Network có thể timeout sau khi server đã xử lý thành công. Client retry vì không biết kết quả. Vì vậy:

- User sync cần idempotent.
- Submit attempt cần idempotency key hoặc state transition an toàn.
- AI job cần tránh tính phí hai lần khi retry.

## Lesson 6 — Testing strategy

Học khi làm: `P2.3`.

- Unit: grading pure function.
- Integration: service + Prisma + test database.
- E2E: HTTP request qua guard, validation, controller và database.
- Contract: frontend/backend đồng ý về request/response.

Ưu tiên test nơi lỗi gây thiệt hại lớn: sai điểm, lộ đáp án, vượt quyền và mất bài làm.

## Lesson 7 — Observability và operations

Học khi làm: `P2.4`, `P2.6`.

Production engineering không kết thúc khi code chạy local. Cần trả lời được:

- Hệ thống có đang hoạt động không?
- Request nào đang lỗi?
- Dependency nào chậm?
- Deployment nào gây regression?
- Có rollback được không?

## Lesson 8 — Async jobs và external APIs

Học khi làm: `P4.1`.

AI grading không nên giữ một HTTP connection lâu. API nhận submission, tạo job và trả job ID. Worker xử lý, lưu kết quả; frontend poll hoặc nhận notification khi hoàn thành.

---

# 7. Recommended execution order

Không chạy nhiều task rủi ro cao đồng thời. Thứ tự đề xuất:

1. `P0.1` Reproducible setup.
2. `P0.2` Project hygiene.
3. `P1.1` Environment validation.
4. `P1.2` DTO validation.
5. `P1.4` Server-side grading và answer-key protection.
6. `P1.5` User sync.
7. `P1.6` Prisma migrations.
8. `P1.3` HTTP hardening và API versioning.
9. `P2.3` Critical automated tests.
10. `P2.1` Centralized API client.
11. `P2.2` OpenAPI/contracts.
12. `P2.4` Observability.
13. `P2.5` Abuse protection.
14. `P2.6` CI/CD và deployment.
15. Phase 3 product features.
16. Phase 4 AI grading.

Lý do grading đứng trước AI: một hệ thống chấm điểm cơ bản nhưng đáng tin có giá trị hơn AI feature đặt trên trust boundary chưa an toàn.

# 8. Suggested milestones

## Milestone A — Secure MVP

- Hoàn thành toàn bộ Phase 0 và Phase 1.
- Có test cho grading, auth ownership và user sync.
- Có thể demo mà user không tự sửa điểm hoặc xem đáp án trước.

## Milestone B — Production Candidate

- Hoàn thành Phase 2.
- Deploy staging và production tái lập được.
- Có monitoring, rollback và smoke tests.

## Milestone C — Portfolio Release

- Có ít nhất P3.1 và P3.2.
- Root README, diagram, demo account, screenshots và engineering decisions hoàn chỉnh.
- Repository sạch, CI xanh và API docs truy cập được.

## Milestone D — AI Release

- Có queue, quota, evaluation và cost monitoring.
- Writing hoặc Speaking grading được release sau staged evaluation.

# 9. Decision Log

Ghi quyết định theo mẫu:

```text
Date:
Decision:
Context:
Alternatives considered:
Why chosen:
Consequences/trade-offs:
```

### D-001 — Modular monolith trước microservices

- **Date:** 2026-08-28
- **Decision:** Giữ một NestJS backend được chia module theo domain.
- **Context:** Quy mô hiện tại chưa cần chi phí vận hành của microservices.
- **Alternatives considered:** Tách auth, grading và tests thành service riêng.
- **Why chosen:** Dễ phát triển, transaction và deploy; vẫn giữ ranh giới module.
- **Consequences/trade-offs:** Cần kỷ luật dependency giữa module; có thể tách AI worker sau khi nhu cầu thực tế xuất hiện.

### D-002 — Backend là authority cho grading

- **Date:** 2026-08-28
- **Decision:** Client không được quyết định score hoặc truy cập answer key trước submit.
- **Context:** Client hiện gửi score và test content có thể chứa đáp án.
- **Alternatives considered:** Giữ client grading để giảm backend work.
- **Why chosen:** Client-controlled score không thể tin cậy trong production.
- **Consequences/trade-offs:** Backend cần grading engine và test coverage; request submit phức tạp hơn.

### D-003 — JSONB cho nội dung đề ở giai đoạn hiện tại

- **Date:** 2026-08-28
- **Decision:** Tiếp tục dùng JSONB, kèm schema validation và content version.
- **Context:** IELTS có nhiều question type và cấu trúc nested.
- **Alternatives considered:** Chuẩn hóa toàn bộ content thành nhiều relational tables.
- **Why chosen:** Linh hoạt và tránh over-engineering trong MVP.
- **Consequences/trade-offs:** Query sâu khó hơn; validation phải làm ở application/import boundary.

### D-004 — Cloud Run cho NestJS backend

- **Date:** 2026-08-31
- **Decision:** Deploy NestJS dưới dạng Docker container trên Google Cloud Run; giữ frontend trên Vercel và database/auth trên Supabase.
- **Context:** Azure for Students đã hết hạn; owner vẫn muốn giữ NestJS để học backend và xây application boundary độc lập.
- **Alternatives considered:** Next.js full-stack trên Vercel, Cloudflare Workers, AWS Lambda, AWS App Runner, Render Free và VPS.
- **Why chosen:** Giữ nguyên Node/NestJS runtime, hỗ trợ container portable, scale-to-zero, revision rollback, IAM và CI/CD phù hợp mục tiêu học production backend.
- **Consequences/trade-offs:** Có cold start khi min instances bằng 0; cần Google Cloud billing, Artifact Registry, Secret Manager và quyền IAM cho Cloud Build; outbound traffic tới Supabase có thể phát sinh chi phí.

# 10. Progress Log

Ghi mỗi phiên làm việc theo mẫu:

```text
## YYYY-MM-DD — Task ID

- Scope approved:
- Files changed:
- Tests run:
- Result:
- Remaining risk:
- Next recommended task:
```

## 2026-08-28 — Planning baseline

- **Scope approved:** Tạo living plan cho production roadmap và backend curriculum.
- **Files changed:** `docs/PRODUCTION_BUILD_PLAN.md`.
- **Tests run:** Documentation-only; kiểm tra file tồn tại và Git diff.
- **Result:** Roadmap, acceptance criteria, learning path và decision log đã được khởi tạo.
- **Remaining risk:** Toàn bộ implementation task vẫn chưa bắt đầu.
- **Next recommended task:** `P0.1 — Reproducible local setup` sau khi owner duyệt scope cụ thể.

## 2026-08-29 — P0.1 Reproducible local setup

- **Scope approved:** Root command hub, env templates, pinned Node/npm toolchain, clean setup documentation và build verification cho hai application.
- **Files changed:** Root `package.json`, `.nvmrc`, `.node-version`, `.npmrc`, `README.md`, `.gitignore`, `frontend/.env.example`, `backend/.env.example`, hai application `package.json` và backend lockfile metadata.
- **Tests run:** Frontend và backend typecheck pass; backend unit test pass (1 suite/1 test); frontend và backend production build pass. Lint baseline được đo: frontend 15 errors/18 warnings, backend 70 errors/10 warnings.
- **Result:** Reproducible setup tooling, documentation và build-blocker cleanup đã hoàn thành. Hai application đều vượt qua typecheck và production build với Node 22.15.0.
- **Remaining risk:** Quality gate lint chưa xanh; backend chủ yếu còn formatting, untyped request và DTO debt. Frontend còn explicit `any`, render mutation và hygiene warnings. Đây là debt đã tồn tại trước P0.1 và được lên lịch xử lý theo P0.2/P1.2.
- **Next recommended task:** `P0.2 — Remove stale architecture artifacts` sau khi owner duyệt scope cụ thể.

## 2026-08-31 — Cloud Run deployment foundation

- **Scope approved:** Giữ Next.js frontend trên Vercel và NestJS backend độc lập; thay hướng Azure bằng Google Cloud Run container với scale-to-zero, bounded scaling, Secret Manager, health endpoints và CORS production. Deployment backend được đơn giản hóa thành GitHub repository kết nối trực tiếp với Google Cloud Build.
- **Files changed:** Backend Docker assets, production bootstrap/config validation, health module, env template, root README và Cloud Run deployment documentation; workflow GitHub Actions/OIDC được bỏ để tránh deployment trùng.
- **Tests run:** Backend targeted lint và typecheck pass; 2 Jest suites/4 tests pass; production build chạy lặp lại hai lần và đều phát `dist/main.js`; local smoke test trả HTTP 200 cho `/health/live` và `/health/ready` với kết nối Supabase thành công. Docker engine không có trên máy nên container build sẽ được xác minh bởi Cloud Build.
- **Result:** Repository có deployment foundation reproducible và ranh giới monorepo rõ ràng: Vercel build `frontend/`, Cloud Build build `backend/`.
- **Remaining risk:** Chưa có committed Prisma migration baseline; chưa có remote container-build evidence; cold-start và Supabase connection behavior cần đo sau lần deploy đầu tiên.
- **Next recommended task:** Đặt Vercel Root Directory thành `frontend`, kết nối GitHub trong Cloud Run với `backend/Dockerfile`, rồi xác minh lần deploy đầu tiên.

# 11. Portfolio evidence checklist

- [ ] Root README đúng với code thực tế.
- [ ] Architecture diagram.
- [ ] Auth sequence diagram.
- [ ] Submit/grading sequence diagram.
- [ ] ERD.
- [ ] OpenAPI documentation.
- [ ] Demo URL và demo account.
- [ ] CI status badge.
- [ ] Test strategy và một số test case tiêu biểu.
- [ ] Engineering decision log.
- [ ] Screenshots/GIF ngắn.
- [ ] Deployment và rollback documentation.
- [ ] Security notes: trust boundary, answer-key protection, authorization.
- [ ] AI evaluation report trước khi release AI feature.

# 12. Questions phải trả lời trước từng phase

## Trước Phase 1

- Answer key hiện nằm ở đâu trong từng loại test content?
- Supabase project đang dùng JWT signing mode nào?
- Có dữ liệu production cần giữ lại khi tạo migration baseline không?
- Domain production/staging dự kiến là gì?

## Trước Phase 2

- Chọn test database local/container hay Supabase test project?
- Chọn error monitoring và logging destination nào?
- Backend deploy bằng Docker container trên Google Cloud Run; image được tag bằng Git commit SHA.

## Trước Phase 3

- Có cho guest làm bài không?
- Attempt autosave theo interval, debounce hay section transition?
- Quy tắc resume và hết giờ là gì?

## Trước Phase 4

- Provider AI ưu tiên và ngân sách mỗi user là bao nhiêu?
- Audio retention bao lâu?
- Dataset nào dùng để đánh giá chất lượng chấm?
- UX sẽ diễn đạt giới hạn của AI score như thế nào?
