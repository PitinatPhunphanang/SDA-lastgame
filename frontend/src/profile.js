import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const [user, setUser] = useState(null); // ข้อมูลผู้ใช้ที่ล็อกอินอยู่

  // ดึงข้อมูล User ที่ล็อกอินอยู่
  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("authToken"); // ดึง JWT
      if (!token) {
        console.error("No JWT Token found.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:1337/api/users/me", {
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
        {/* ลิงค์กลับหน้าหลัก */}
        <div className="position-absolute" style={{ bottom: "20px", left: "20px" }}>
          <a href="/" className="text-white fs-1">
            🏠
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
