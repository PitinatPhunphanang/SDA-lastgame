import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import conf from "./conf/main";

function Profile() {
  const [user, setUser] = useState(null); // ข้อมูลผู้ใช้ที่ล็อกอินอยู่
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ควบคุมการแสดง modal ยืนยันล็อกเอ้าท์
  const navigate = useNavigate();

  // ดึงข้อมูล User ที่ล็อกอินอยู่
  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("authToken"); // ดึง JWT
      if (!token) {
        console.error("No JWT Token found.");
        return;
      }

      try {
        const response = await axios.get(`${conf.apiUrlPrefix}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Data:", response.data);
        setUser(response.data); // บันทึกข้อมูลผู้ใช้
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  // ฟังก์ชันล็อกเอ้าท์
  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // ลบ JWT ออกจาก sessionStorage
    window.location.href = "/Signin"; // ไปที่หน้า Signin
  };

  const handleGoHome = () => navigate('/');

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: "url(/777.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-dark text-light p-4 rounded-3 text-center" style={{ width: "50%" }}>
        <h2 className="mb-4" style={{ fontSize: "3rem", fontFamily: "Georgia, serif" }}>
          โปรไฟล์ของฉัน
        </h2>

        {/* แสดงโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่ */}
        {user && (
          <div className="mb-4">
            {user.avatar ? (
              <img
                src={user.avatar.url}
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: "150px", height: "150px", border: "4px solid white" }}
              />
            ) : (
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "150px", color: "white" }}
              ></i>
            )}
            <h3 className="mt-3">{`Name: ${user.username}`}</h3>
          </div>
        )}

        {/* ปุ่มล็อกเอ้าท์ */}
        <button
          className="btn btn-danger mt-4"
          style={{ width: "100%", fontSize: "1.5rem", borderRadius: "12px" }}
          onClick={() => setShowLogoutModal(true)} // เปิด modal ยืนยันล็อกเอ้าท์
        >
          ล็อกเอ้าท์
        </button>

        <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={handleGoHome}>
        <i className="bi bi-house"></i> 
      </div>
      </div>

      {/* Modal ยืนยันการล็อกเอ้าท์ */}
      {showLogoutModal && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "15px",
              width: "400px",
              margin: "auto",
              position: "relative",
              top: "40%",
            }}
          >
            <h4>คุณต้องการล็อกเอ้าท์หรือไม่?</h4>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                style={{ marginRight: "20px", width: "150px" }}
                onClick={handleLogout} // ล็อกเอ้าท์
              >
                ยืนยัน
              </button>
              <button
                className="btn btn-danger"
                style={{ width: "150px" }}
                onClick={() => setShowLogoutModal(false)} // ปิด modal
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
