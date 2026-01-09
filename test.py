import psycopg2

# Thông tin kết nối
DB_CONFIG = {
    'dbname': 'BlueMoon',
    'user': 'postgres',
    'password': '200103',
    'host': 'localhost',
    'port': '5432'
}

def delete_admins():
    """
    Xóa tất cả admin trừ admin có ID: c5998398-1bcc-485b-9280-e07467dd593c
    """
    conn = None
    cursor = None
    
    keep_admin_id = 'c5998398-1bcc-485b-9280-e07467dd593c'
    
    try:
        # Kết nối database
        print("Đang kết nối đến database BlueMoon...")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Kiểm tra số lượng admin hiện tại
        print("\n1. Kiểm tra số lượng admin...")
        cursor.execute("""
            SELECT COUNT(*) 
            FROM residents 
            WHERE role = 'admin'
        """)
        total_admins = cursor.fetchone()[0]
        print(f"   Tổng số admin: {total_admins}")
        
        # Kiểm tra admin cần giữ lại có tồn tại không
        cursor.execute("""
            SELECT "ID_Resident", name, email 
            FROM residents 
            WHERE "ID_Resident" = %s AND role = 'admin'
        """, (keep_admin_id,))
        
        keep_admin = cursor.fetchone()
        if not keep_admin:
            print(f"   ⚠️  CẢNH BÁO: Không tìm thấy admin với ID {keep_admin_id}!")
            print("   Vui lòng kiểm tra lại ID!")
            return
        
        print(f"   ✓ Sẽ giữ lại admin: {keep_admin[1]} ({keep_admin[2]})")
        
        # Lấy danh sách admin cần xóa
        print("\n2. Xác định admin cần xóa...")
        cursor.execute("""
            SELECT "ID_Resident", name, email 
            FROM residents 
            WHERE role = 'admin' AND "ID_Resident" != %s
        """, (keep_admin_id,))
        
        delete_admins = cursor.fetchall()
        print(f"   Sẽ xóa {len(delete_admins)} admin:")
        for admin in delete_admins:
            print(f"      - {admin[1]} ({admin[2]})")
        
        if len(delete_admins) == 0:
            print("   Không có admin nào cần xóa!")
            return
        
        delete_admin_ids = [admin[0] for admin in delete_admins]
        
        # Xóa dữ liệu liên quan
        print("\n3. Xóa dữ liệu liên quan đến admin...")
        
        # Xóa donate_residents
        cursor.execute("""
            DELETE FROM donate_residents 
            WHERE resident_id = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} bản ghi từ donate_residents")
        
        # Xóa shifts
        cursor.execute("""
            DELETE FROM shifts 
            WHERE "ID_guard" = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} ca trực từ shifts")
        
        # Xóa complain
        cursor.execute("""
            DELETE FROM complain 
            WHERE "ID_resident" = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} khiếu nại từ complain")
        
        # Xóa invoices
        cursor.execute("""
            DELETE FROM invoices 
            WHERE "ID_resident" = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} hóa đơn từ invoices")
        
        # Xóa resident_notifications
        cursor.execute("""
            DELETE FROM resident_notifications 
            WHERE "Resident_ID" = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} thông báo từ resident_notifications")
        
        # Xóa admin
        print("\n4. Xóa admin...")
        cursor.execute("""
            DELETE FROM residents 
            WHERE "ID_Resident" = ANY(%s)
        """, (delete_admin_ids,))
        print(f"   ✓ Đã xóa {cursor.rowcount} admin")
        
        # Kiểm tra lại
        cursor.execute("""
            SELECT COUNT(*) 
            FROM residents 
            WHERE role = 'admin'
        """)
        remaining_admins = cursor.fetchone()[0]
        print(f"\n5. Số admin còn lại: {remaining_admins}")
        
        # Commit
        conn.commit()
        print("\n✅ HOÀN THÀNH! Đã lưu thay đổi.")
        
    except Exception as e:
        if conn:
            conn.rollback()
            print(f"\n❌ LỖI! Đã rollback.")
        print(f"Chi tiết lỗi: {e}")
        raise
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("\nĐã đóng kết nối database.")

if __name__ == "__main__":
    print("="*60)
    print("SCRIPT XÓA ADMIN - CHỈ GIỮ LẠI 1 ADMIN")
    print("="*60)
    
    confirmation = input("\n⚠️  Bạn có chắc muốn xóa tất cả admin (trừ 1)? (yes/no): ")
    
    if confirmation.lower() == 'yes':
        delete_admins()
    else:
        print("\n❌ Đã hủy.")