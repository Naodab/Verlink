import { FileUploadExample } from "@/components/examples/file-upload-example"

export default function FileUploadPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Ví dụ Upload File với Chunking</h1>
      <p className="mb-6 text-muted-foreground">
        Trang này minh họa cách sử dụng chức năng upload file với khả năng cắt file (chunking) để tải lên các file lớn.
        Khi file lớn hơn 1MB, hệ thống sẽ tự động chia nhỏ file thành các phần và tải lên từng phần.
      </p>
      <FileUploadExample />
    </div>
  )
}
