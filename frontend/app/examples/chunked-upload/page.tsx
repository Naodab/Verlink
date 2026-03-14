import { ChunkedUploadExample } from "@/components/examples/chunked-upload-example"

export default function ChunkedUploadPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Ví dụ về Upload File theo Chunk</h1>
      <p className="mb-8 text-muted-foreground">
        Trang này minh họa cách sử dụng tính năng upload file theo chunk khi đăng bài và chỉnh sửa bài viết. Các file
        lớn sẽ được chia thành các phần nhỏ (chunk) và upload lần lượt, giúp tăng hiệu suất và khả năng phục hồi khi
        mạng không ổn định.
      </p>

      <ChunkedUploadExample />

      <div className="mt-10 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Giải thích kỹ thuật</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. Chia file thành các chunk</h3>
            <p className="text-sm text-muted-foreground">
              Khi người dùng chọn file lớn, hệ thống sẽ chia file thành các phần nhỏ (mặc định 1MB mỗi chunk) bằng cách
              sử dụng phương thức <code>file.slice()</code>.
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Upload từng chunk</h3>
            <p className="text-sm text-muted-foreground">
              Mỗi chunk được upload lần lượt lên server với thông tin về vị trí của nó trong file gốc. Server sẽ lưu trữ
              tạm thời các chunk này.
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Hoàn tất quá trình upload</h3>
            <p className="text-sm text-muted-foreground">
              Sau khi tất cả các chunk đã được upload, client sẽ gửi một request cuối cùng để thông báo cho server ghép
              các chunk lại thành file hoàn chỉnh.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Theo dõi tiến trình</h3>
            <p className="text-sm text-muted-foreground">
              Trong quá trình upload, tiến trình của từng file được theo dõi và hiển thị cho người dùng. Nếu có lỗi xảy
              ra, người dùng có thể thử lại mà không cần upload lại từ đầu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
