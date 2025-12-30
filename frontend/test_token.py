import requests
import base64
import json
import re

# Thư viện để tạo QR code
try:
    import qrcode
    from PIL import Image
    QRCODE_AVAILABLE = True
except ImportError:
    QRCODE_AVAILABLE = False
    print("Warning: qrcode library not installed. Install with: pip install qrcode[pil]")

# Thông tin đăng nhập
username = "customer-taki2003-user25468"
password = "Y3VzdG9tZXItdGFraTIwMDMtdXNlcjI1NDY4"

# Lấy token
raw = f"{username}:{password}"
auth = base64.b64encode(raw.encode()).decode()

headers = {
    "Authorization": f"Basic {auth}"
}

print("=== Lấy token ===")
r = requests.post(
    "https://dev.vietqr.org/vqr/api/token_generate",
    headers=headers,
    timeout=10
)

print(f"Status code: {r.status_code}")
print(f"Response: {r.text}")

# Lấy token từ response
token = None
try:
    if r.status_code == 200:
        # Thử parse JSON
        try:
            data = r.json()
            token = data.get('token') or data.get('access_token') or data.get('accessToken') or data.get('data')
        except:
            # Nếu không phải JSON, lấy text thuần
            token = r.text.strip()
except Exception as e:
    print(f"Error parsing token: {e}")

if not token:
    print("Không thể lấy token!")
    exit(1)

print(f"\nToken: {token}\n")

# Tạo QR code
print("=== Tạo QR code ===")

# Hàm loại bỏ dấu tiếng Việt
def remove_vietnamese_tones(text):
    # Chuyển về dạng NFD và loại bỏ dấu
    import unicodedata
    text = unicodedata.normalize('NFD', text)
    text = re.sub(r'[\u0300-\u036f]', '', text)
    # Loại bỏ ký tự đặc biệt, chỉ giữ chữ, số và khoảng trắng
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text[:23]  # Tối đa 23 ký tự

# Thông tin thanh toán (ví dụ)
bank_code = "BIDV"  # Mã ngân hàng
bank_account = "3902047963"  # Số tài khoản
user_bank_name = "NGUYEN HUY HOANG"  # Tên chủ tài khoản (không dấu)
content = "ND ABC12345 NGUYEN VAN A"  # Nội dung chuyển khoản (không dấu, tối đa 23 ký tự)
amount = 500000  # Số tiền
order_id = "ABC12345"  # Mã đơn hàng (tối đa 13 ký tự)

# Làm sạch dữ liệu
clean_content = remove_vietnamese_tones(content)
clean_name = remove_vietnamese_tones(user_bank_name)

qr_data = {
    "bankCode": bank_code,
    "bankAccount": bank_account,
    "userBankName": clean_name,
    "content": clean_content,
    "qrType": 0,  # 0: VietQR động, 1: VietQR tĩnh, 3: VietQR bán động
    "amount": amount,
    "orderId": order_id,
    "transType": "C"  # C: Ghi có, D: Ghi nợ
}

headers_qr = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

r_qr = requests.post(
    "https://dev.vietqr.org/vqr/api/qr/generate-customer",
    headers=headers_qr,
    json=qr_data,
    timeout=10
)

print(f"Status code: {r_qr.status_code}")
print(f"Response: {r_qr.text}")

qr_string = None  # Biến để lưu chuỗi QR code từ API

if r_qr.status_code == 200:
    try:
        data = r_qr.json()
        print(f"\n=== Response từ API ===")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        # Kiểm tra nhiều field có thể có cho chuỗi QR code
        # API có thể trả về chuỗi EMV QR Code trong các field như: qrString, data, qrData, qr, content, etc.
        qr_string = (data.get('qrString') or data.get('qrStringData') or data.get('qrData') or 
                    data.get('data') or data.get('qr') or data.get('content') or data.get('qrCodeString'))
        
        # Kiểm tra các field cho ảnh/base64/URL
        qr_image = (data.get('qrDataURL') or data.get('qrCode') or data.get('image') or 
                   data.get('qrImage') or data.get('url') or data.get('link'))
        
        if qr_string:
            print(f"\n=== Chuỗi QR Code từ API ===")
            print(f"QR String: {qr_string}")
        elif qr_image:
            print(f"\n=== QR Code (ảnh/URL) ===")
            if qr_image.startswith('http://') or qr_image.startswith('https://'):
                print(f"QR Code URL: {qr_image}")
            else:
                print(f"QR Code (base64): {qr_image[:50]}...")
        else:
            print("\nKhông tìm thấy QR code trong response")
            print("Các key có trong response:", list(data.keys()))
    except Exception as e:
        print(f"Error parsing QR response: {e}")
else:
    print(f"Lỗi khi tạo QR code: {r_qr.status_code} - {r_qr.text}")

# Tạo ảnh QR code từ chuỗi lấy từ API
if qr_string:
    print("\n=== Tạo ảnh QR code từ chuỗi API ===")

    if QRCODE_AVAILABLE:
        try:
            # Tạo mã QR từ chuỗi lấy từ API
            qr = qrcode.QRCode(
                version=1,  # Kích thước mã QR (tự động điều chỉnh nếu cần)
                error_correction=qrcode.constants.ERROR_CORRECT_L,  # Mức độ sửa lỗi (L, M, Q, H)
                box_size=10,  # Kích thước mỗi ô vuông (pixels)
                border=4,  # Độ dày viền (số ô vuông)
            )
            qr.add_data(qr_string)
            qr.make(fit=True)

            # Tạo hình ảnh mã QR
            img = qr.make_image(fill_color="black", back_color="white")

            # Lưu hình ảnh
            filename = "qr_code_from_api.png"
            img.save(filename)
            print(f"Đã lưu QR code vào file: {filename}")

            # Hiển thị hình ảnh (mở bằng ứng dụng mặc định)
            try:
                img.show()
                print("Đã mở ảnh QR code")
            except Exception as e:
                print(f"Không thể mở ảnh tự động: {e}")
                print(f"Vui lòng mở file {filename} để xem QR code")

            # Tạo base64 để có thể dùng trong web
            import io
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            print(f"\nQR Code Base64 (để dùng trong web):")
            print(f"data:image/png;base64,{img_base64[:50]}...")

        except Exception as e:
            print(f"Lỗi khi tạo QR code: {e}")
    else:
        print("Không thể tạo QR code vì thiếu thư viện qrcode")
        print("Cài đặt: pip install qrcode[pil]")
else:
    print("\nKhông có chuỗi QR code từ API để tạo ảnh")
