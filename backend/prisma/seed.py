import os
import psycopg2
from psycopg2.extras import execute_values
import bcrypt
from datetime import datetime
from urllib.parse import urlparse
import uuid


def get_db_connection_params():
    """
    Build psycopg2 connection kwargs using DATABASE_URL when available so that
    the seed script stays in sync with Prisma configuration.
    """
    database_url = os.environ.get("DATABASE_URL")

    if database_url:
        parsed = urlparse(database_url)
        if parsed.scheme not in ("postgresql", "postgres"):
            raise ValueError(
                f"Unsupported DATABASE_URL scheme: {parsed.scheme}. "
                "Expected postgresql:// or postgres://"
            )

        return {
            "host": parsed.hostname or "localhost",
            "port": parsed.port or 5432,
            "database": (parsed.path or "/").lstrip("/"),
            "user": parsed.username or "postgres",
            "password": parsed.password,
        }

    # Fall back to discrete env vars or final hardcoded defaults for dev usage.
    return {
        "host": os.environ.get("DB_HOST", "localhost"),
        "port": int(os.environ.get("DB_PORT", 5432)),
        "database": os.environ.get("DB_NAME", "BlueMoon"),
        "user": os.environ.get("DB_USER", "postgres"),
        "password": os.environ.get("DB_PASSWORD", "123456"),
    }

# Kết nối database
conn = psycopg2.connect(**get_db_connection_params())
conn.autocommit = True
cur = conn.cursor()

try:
    print('🌱 Bắt đầu seed dữ liệu...')
    
    # Xóa dữ liệu cũ (theo thứ tự để tránh lỗi foreign key)
    cur.execute("DELETE FROM resident_notifications")
    cur.execute("DELETE FROM complain")
    cur.execute("DELETE FROM invoices")
    cur.execute("DELETE FROM services")
    cur.execute("DELETE FROM notifications")
    cur.execute("DELETE FROM residents")
    cur.execute("DELETE FROM apartments")
    
    print('✅ Đã xóa dữ liệu cũ')
    
    # Password mặc định
    plain_password = '123'
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # 1. Tạo 4 apartments tạm thời
    apartments_data = [
        (str(1), 'A101', '2023-01-01', '2025-12-31', 'temp-owner-001', 75.5),
        (str(2), 'A102', '2023-03-15', '2026-03-14', 'temp-owner-002', 85.0),
        (str(3), 'A201', '2023-06-01', '2025-05-31', 'temp-owner-003', 95.5),
        (str(4), 'A202', '2023-02-10', '2026-02-09', 'temp-owner-004', 80.0),
    ]
    
    execute_values(
        cur,
        """
        INSERT INTO apartments ("ID_Apartment", "Name", contract_startdate, contract_enddate, "ID_owner", area)
        VALUES %s
        """,
        apartments_data
    )
    
    cur.execute('SELECT "ID_Apartment", "Name" FROM apartments ORDER BY "Name"')
    apartments = cur.fetchall()
    apartment_ids = [apt[0] for apt in apartments]
    
    print(f'✅ Đã tạo {len(apartment_ids)} căn hộ')
    
    # 2. Tạo 4 owners (residents)
    owners_data = [
        (str(uuid.uuid4()), apartment_ids[0], 'Nguyễn Văn An', '0901234567', hashed_password, 
         'nguyenvanan@gmail.com', 'resident', False, '001234567890', '1985-03-15'),
        (str(uuid.uuid4()), apartment_ids[1], 'Trần Thị Bình', '0901234568', hashed_password,
         'tranthibinh@gmail.com', 'resident', False, '001234567891', '1987-06-20'),
        (str(uuid.uuid4()), apartment_ids[2], 'Lê Minh Cường', '0901234569', hashed_password,
         'leminhcuong@gmail.com', 'resident', False, '001234567892', '1990-11-10'),
        (str(uuid.uuid4()), apartment_ids[3], 'Phạm Thu Dung', '0901234570', hashed_password,
         'phamthudung@gmail.com', 'resident', False, '001234567893', '1992-08-25'),
    ]
    
    execute_values(
        cur,
        """
        INSERT INTO residents ("ID_Resident", "ID_apartment", name, phone, password, email, role, "temporaryStatus", "CMND", birth)
        VALUES %s
        """,
        owners_data
    )
    
    cur.execute('SELECT "ID_Resident" FROM residents ORDER BY name LIMIT 4')
    owner_ids = [row[0] for row in cur.fetchall()]
    
    # Cập nhật ownerId
    for i, apt_id in enumerate(apartment_ids):
        cur.execute(
            'UPDATE apartments SET "ID_owner" = %s WHERE "ID_Apartment" = %s',
            (owner_ids[i], apt_id)
        )
    
    print(f'✅ Đã tạo {len(owner_ids)} chủ căn hộ và cập nhật ownerId')
    
    # 3. Tạo thêm residents
    additional_residents_data = [
        # Căn hộ A101 - thêm 2 cư dân
        (str(uuid.uuid4()), apartment_ids[0], 'Nguyễn Thị Mai', '0901234578', hashed_password,
         'nguyenthimai@gmail.com', 'resident', False, '001234567901', '1990-05-20'),
        (str(uuid.uuid4()), apartment_ids[0], 'Nguyễn Văn Hùng', '0901234579', hashed_password,
         'nguyenvanhung@gmail.com', 'resident', True, '001234567902', '1995-08-15'),
        # Căn hộ A102 - thêm 3 cư dân
        (str(uuid.uuid4()), apartment_ids[1], 'Trần Văn Đức', '0901234580', hashed_password,
         'tranvanduc@gmail.com', 'resident', False, '001234567903', '1992-03-10'),
        (str(uuid.uuid4()), apartment_ids[1], 'Trần Thị Lan', '0901234581', hashed_password,
         'tranthilan@gmail.com', 'resident', False, '001234567904', '1994-11-25'),
        (str(uuid.uuid4()), apartment_ids[1], 'Trần Văn Phúc', '0901234582', hashed_password,
         'tranvanphuc@gmail.com', 'resident', True, '001234567905', '1998-07-08'),
        # Căn hộ A201 - thêm 2 cư dân
        (str(uuid.uuid4()), apartment_ids[2], 'Lê Thị Hoa', '0901234583', hashed_password,
         'lethihoa@gmail.com', 'resident', False, '001234567906', '1991-09-12'),
        (str(uuid.uuid4()), apartment_ids[2], 'Lê Văn Nam', '0901234584', hashed_password,
         'levannam@gmail.com', 'resident', False, '001234567907', '1993-04-20'),
        # Căn hộ A202 - thêm 3 cư dân
        (str(uuid.uuid4()), apartment_ids[3], 'Phạm Văn Khoa', '0901234585', hashed_password,
         'phamvankhoa@gmail.com', 'resident', False, '001234567908', '1989-12-05'),
        (str(uuid.uuid4()), apartment_ids[3], 'Phạm Thị Oanh', '0901234586', hashed_password,
         'phamthioanh@gmail.com', 'resident', True, '001234567909', '1996-06-18'),
        (str(uuid.uuid4()), apartment_ids[3], 'Phạm Văn Đạt', '0901234587', hashed_password,
         'phamvandat@gmail.com', 'resident', False, '001234567910', '1997-03-22'),
    ]
    
    execute_values(
        cur,
        """
        INSERT INTO residents ("ID_Resident", "ID_apartment", name, phone, password, email, role, "temporaryStatus", "CMND", birth)
        VALUES %s
        """,
        additional_residents_data
    )
    
    cur.execute('SELECT "ID_Resident", name FROM residents')
    residents = cur.fetchall()
    
    print(f'✅ Đã tạo thêm {len(additional_residents_data)} cư dân')
    print(f'✅ Tổng cộng {len(residents)} cư dân')
    
    # 4. Tạo Services - 7 LOẠI PHÍ CỐ ĐỊNH
    # Mỗi loại phí là 1 bản ghi Service
    print('\n📝 Đang tạo 7 loại phí (Services)...')
    
    service_types = [
        ('Phí thuê', '2024-11', 3000000, 'unpaid'),
        ('Phí điện', '2024-11', 900000, 'unpaid'),
        ('Phí nước', '2024-11', 400000, 'unpaid'),
        ('Phí gửi xe', '2024-11', 300000, 'unpaid'),
        ('Phí vệ sinh', '2024-11', 200000, 'unpaid'),
        ('Phí dịch vụ', '2024-11', 500000, 'unpaid'),
        ('Phí nhà ở', '2024-11', 300000, 'unpaid'),
    ]
    
    service_ids = []
    for name, month, amount, status in service_types:
        cur.execute(
            """
            INSERT INTO services (name, month, "totalAmount", status, "createdAt", "updatedAt")
            VALUES (%s, %s, %s, %s, NOW(), NOW())
            RETURNING "ID_khoan_thu"
            """,
            (name, month, amount, status)
        )
        service_id = cur.fetchone()[0]
        service_ids.append(service_id)
        print(f'   ✓ {name}: {amount:,} VNĐ')
    
    print(f'\n✅ Đã tạo {len(service_ids)} loại phí (Services)')
    
    # 5. Tạo Invoices - Mỗi cư dân có 1 invoice cho MỖI loại phí
    print('\n📝 Đang tạo hóa đơn cho từng cư dân...')
    
    invoices_data = []
    invoice_count_per_resident = {}
    
    # Chỉ tạo cho 4 chủ căn hộ
    for resident_id, resident_name in residents[:4]:
        invoice_count_per_resident[resident_name] = 0
        
        # Mỗi cư dân có 1 invoice cho MỖI loại phí
        for service_id in service_ids:
            # Lấy thông tin service
            cur.execute('SELECT name, month, "totalAmount" FROM services WHERE "ID_khoan_thu" = %s', (service_id,))
            service_name, month, amount = cur.fetchone()
            
            invoices_data.append((
                str(uuid.uuid4()),
                service_id,
                resident_id,
                f'HĐ {service_name} tháng {month} - {resident_name}',
                amount / len(apartment_ids)  # Chia đều cho các căn hộ
            ))
            invoice_count_per_resident[resident_name] += 1
    
    execute_values(
        cur,
        """
        INSERT INTO invoices ("ID_invoice", "ID_service", "ID_resident", "Name", "Money", "CreateDate")
        VALUES %s
        """,
        [(i[0], i[1], i[2], i[3], i[4], datetime.now()) for i in invoices_data]
    )
    
    print(f'✅ Đã tạo {len(invoices_data)} hóa đơn')
    for name, count in list(invoice_count_per_resident.items())[:4]:
        print(f'   - {name}: {count} hóa đơn')
    
    # 6. Tạo Notifications
    notifications_data = [
        (str(uuid.uuid4()), 'Thông báo bảo trì hệ thống điện vào ngày 15/12/2024. Vui lòng chuẩn bị nguồn điện dự phòng.', 'Ban Quản Lý'),
        (str(uuid.uuid4()), 'Thông báo tăng phí gửi xe từ tháng 12/2024. Chi tiết xem tại văn phòng quản lý.', 'Ban Quản Lý'),
        (str(uuid.uuid4()), 'Lịch cắt nước định kỳ vào thứ 7 tuần này từ 8h-12h để vệ sinh bể nước.', 'Ban Quản Lý'),
        (str(uuid.uuid4()), 'Thông báo tổ chức họp cư dân vào 20h ngày 25/12/2024 tại hội trường tầng 1.', 'Ban Quản Lý'),
        (str(uuid.uuid4()), 'Nhắc nhở cư dân giữ gìn vệ sinh chung, không xả rác bừa bãi.', 'Ban Quản Lý'),
    ]
    
    execute_values(
        cur,
        """
        INSERT INTO notifications (id_notification, info, creator, "createDate")
        VALUES %s
        """,
        [(n[0], n[1], n[2], datetime.now()) for n in notifications_data]
    )
    
    notification_ids = [n[0] for n in notifications_data]
    print(f'✅ Đã tạo {len(notification_ids)} thông báo')
    
    # 7. Tạo ResidentNotifications
    # Kiểm tra tên cột thực tế trong database
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'resident_notifications'
        ORDER BY column_name
    """)
    columns = [row[0] for row in cur.fetchall()]
    
    if not columns:
        print('⚠️  Bảng resident_notifications không tồn tại, bỏ qua...')
    else:
        # Tìm tên cột đúng (có thể là notification_ID, notification_id, hoặc tên khác)
        notif_col = None
        resident_col = None
        
        for col in columns:
            col_lower = col.lower()
            if 'notification' in col_lower:
                notif_col = col
            elif 'resident' in col_lower:
                resident_col = col
        
        if notif_col and resident_col:
            resident_notif_data = []
            for notif_id in notification_ids:
                for resident_id, _ in residents[:8]:
                    resident_notif_data.append((notif_id, resident_id))
            
            # Sử dụng tên cột đúng với dấu ngoặc kép nếu cần
            notif_col_quoted = f'"{notif_col}"' if notif_col != notif_col.lower() else notif_col
            resident_col_quoted = f'"{resident_col}"' if resident_col != resident_col.lower() else resident_col
            
            try:
                execute_values(
                    cur,
                    f"""
                    INSERT INTO resident_notifications ({notif_col_quoted}, {resident_col_quoted})
                    VALUES %s
                    """,
                    resident_notif_data
                )
                print(f'✅ Đã tạo {len(resident_notif_data)} liên kết thông báo-cư dân')
            except Exception as e:
                print(f'⚠️  Lỗi khi tạo resident notifications: {e}')
                print(f'   Đã thử với cột: {notif_col_quoted}, {resident_col_quoted}')
                # Thử lại với tên cột theo schema
                try:
                    execute_values(
                        cur,
                        """
                        INSERT INTO resident_notifications ("notification_ID", "Resident_ID")
                        VALUES %s
                        """,
                        resident_notif_data
                    )
                    print(f'✅ Đã tạo {len(resident_notif_data)} liên kết thông báo-cư dân (thử lại)')
                except Exception as e2:
                    print(f'❌ Vẫn lỗi: {e2}')
        else:
            print(f'⚠️  Không tìm thấy cột phù hợp. Các cột có sẵn: {columns}')
            print('   Thử với tên cột theo schema...')
            resident_notif_data = []
            for notif_id in notification_ids:
                for resident_id, _ in residents[:8]:
                    resident_notif_data.append((notif_id, resident_id))
            
            try:
                execute_values(
                    cur,
                    """
                    INSERT INTO resident_notifications ("notification_ID", "Resident_ID")
                    VALUES %s
                    """,
                    resident_notif_data
                )
                print(f'✅ Đã tạo {len(resident_notif_data)} liên kết thông báo-cư dân')
            except Exception as e:
                print(f'❌ Lỗi: {e}')
                print(f'   Các cột trong bảng: {columns}')
    
    # 8. Tạo Complains
    complains_data = [
        (str(uuid.uuid4()), residents[0][0], 'Thang máy tầng 2 bị hỏng',
         'Thang máy tầng 2 không hoạt động từ 3 ngày nay, rất bất tiện cho cư dân.',
         'resolved', 'Đã liên hệ đội kỹ thuật sửa chữa. Thang máy đã hoạt động trở lại.'),
        (str(uuid.uuid4()), residents[1][0], 'Tiếng ồn vào ban đêm',
         'Căn hộ bên cạnh thường xuyên gây ồn vào ban đêm, ảnh hưởng đến giấc ngủ.',
         'in_progress', 'Đã nhắc nhở cư dân căn hộ liên quan. Sẽ tiếp tục theo dõi.'),
        (str(uuid.uuid4()), residents[2][0], 'Rò rỉ nước tại hành lang tầng 3',
         'Phát hiện rò rỉ nước tại hành lang tầng 3, cần khắc phục gấp.',
         'pending', None),
        (str(uuid.uuid4()), residents[3][0], 'Đèn hành lang tầng 1 không sáng',
         'Đèn hành lang tầng 1 đã hỏng từ tuần trước, ban đêm rất tối.',
         'resolved', 'Đã thay bóng đèn mới.'),
        (str(uuid.uuid4()), residents[4][0], 'Yêu cầu thêm chỗ đậu xe',
         'Chỗ đậu xe không đủ, đề nghị ban quản lý mở rộng khu vực gửi xe.',
         'pending', None),
        (str(uuid.uuid4()), residents[5][0], 'Wifi khu vực công cộng yếu',
         'Tín hiệu wifi tại khu vực sảnh rất yếu, không sử dụng được.',
         'in_progress', 'Đang kiểm tra hệ thống router và sẽ nâng cấp thiết bị.'),
    ]
    
    execute_values(
        cur,
        """
        INSERT INTO complain ("ID_request", "ID_resident", title, message, status, response, created_at, updated_at)
        VALUES %s
        """,
        [(c[0], c[1], c[2], c[3], c[4], c[5], datetime.now(), datetime.now()) for c in complains_data]
    )
    
    print(f'✅ Đã tạo {len(complains_data)} khiếu nại')
    
    # Tính tổng phí
    cur.execute('SELECT SUM("totalAmount") FROM services WHERE month = %s', ('2024-11',))
    total_fee = cur.fetchone()[0]
    
    print('\n' + '='*60)
    print('🎉 HOÀN THÀNH SEED DỮ LIỆU DEMO!')
    print('='*60)
    print('\n📊 TỔNG KẾT:')
    print(f'   - Căn hộ: {len(apartment_ids)}')
    print(f'   - Cư dân: {len(residents)}')
    print(f'   - Loại phí (Services): {len(service_ids)} loại')
    print(f'   - Hóa đơn (Invoices): {len(invoices_data)}')
    print(f'   - Thông báo: {len(notification_ids)}')
    print(f'   - Liên kết thông báo: {len(resident_notif_data)}')
    print(f'   - Khiếu nại: {len(complains_data)}')
    print(f'\n💰 TỔNG PHÍ THÁNG 11/2024: {total_fee:,} VNĐ')
    print('\n📋 CẤU TRÚC:')
    print('   Service: 7 bản ghi (7 loại phí cố định)')
    print('   └─→ Mỗi cư dân có 7 Invoices (1 invoice/loại phí)')
    print('\n🔑 THÔNG TIN ĐĂNG NHẬP:')
    print('   Email: nguyenvanan@gmail.com')
    print('   Password: 123')
    print('='*60)
    
except Exception as e:
    print(f'\n❌ LỖI: {e}')
    import traceback
    traceback.print_exc()
    conn.rollback()
    raise
finally:
    cur.close()
    conn.close()