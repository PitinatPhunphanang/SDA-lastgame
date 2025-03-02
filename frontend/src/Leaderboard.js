import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Leaderboard() {
  const [players, setPlayers] = useState([]); // State สำหรับเก็บข้อมูลผู้เล่น
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลด

  // ดึงข้อมูลผู้เล่นจาก Strapi
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // เปลี่ยน URL ให้ตรงกับ API ของ Strapi ของคุณ
        const response = await axios.get('http://localhost:1337/api/players?populate=avatar'); // ดึงข้อมูลผู้เล่นและภาพ
        const sortedPlayers = response.data.data
          .map(player => ({
            ...player,
            score: player.score || 0, // กำหนดค่าเริ่มต้นให้คะแนนเป็น 0 ถ้าไม่มีคะแนน
          }))
          .sort((a, b) => b.score - a.score) // เรียงลำดับจากคะแนนสูงสุดไปต่ำสุด
          .map((player, index) => ({
            ...player,
            rank: index + 1, // เพิ่มลำดับที่ให้กับผู้เล่น
          }));
        setPlayers(sortedPlayers); // กำหนดค่าผลลัพธ์ลงใน state
        setLoading(false); // ปิดสถานะโหลด
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false); // ปิดสถานะโหลด
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url(/777.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-dark text-light p-4 rounded-3"
        style={{ width: '70%', textAlign: 'center' }}
      >
        <h2 className="mb-4" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif' }}>
          กระดานผู้นำ
        </h2>

        {/* Dropdown สำหรับเลือกเวลา */}
        <div className="mb-4">
          <select className="form-select w-50 mx-auto" style={{ fontSize: '1rem' }}>
            <option>เวลา 5:00 นาที</option>
            <option>เวลา 10:00 นาที</option>
            <option>เวลา 15:00 นาที</option>
          </select>
        </div>

        {/* ตารางผู้เล่น */}
        {loading ? (
          <div>กำลังโหลดข้อมูล...</div> // แสดงข้อความเมื่อกำลังโหลด
        ) : (
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">ลำดับที่</th>
                <th className="text-center">ชื่อ</th>
                <th className="text-center">คะแนน</th>
                <th className="text-center">ภาพ</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'table-light' : 'table-secondary'}
                >
                  <td className="text-center">{player.rank}</td>
                  <td className="text-center">{player.name}</td>
                  <td className="text-center">{player.score}</td>
                  <td className="text-center">
                    {player.avatar ? (
                      <img
                        src={`http://localhost:1337${player.avatar.url}`} // เปลี่ยน URL ให้เป็น URL ของภาพ
                        alt={player.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    ) : (
                      'ไม่มีภาพ'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ลิงค์ไปหน้าหลัก */}
        <div className="position-absolute" style={{ bottom: '20px', left: '20px' }}>
          <a href="/" className="text-white fs-1">
            🏠
          </a>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;