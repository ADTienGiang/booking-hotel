// Tạo một module để quản lý từ điển ánh xạ
export const attributeMappings = {
    'tinhnang': 'Tính năng',
    'chatlieu': 'Chất liệu',
    'kichthuoc': 'Kích thước',
    'chieudaitong': 'Chiều dài tổng sản phẩm',
    'duongkinhvongeo': 'Đường kính vòng eo',
    'trongluong': 'Trọng lượng',
    'khoangcachdieukhien': 'Khoảng cách điều khiển',
    'dungcudieukhien': 'Dụng cụ điều khiển',
    'rung': 'Rung',
    'dacdiem': 'Đặc điểm',
    'pin': 'Pin',
    'chedohoatdong': 'Chế độ hoạt động',
    'nguondien': 'Nguồn điện',
    'thoigiansac': 'Thời gian sạc',
    'thoigiansudung': 'Thời gian sử dụng',
    'thuonghieu': 'Thương hiệu',
    'xuatxu': 'Xuất xứ',
    'doituongsudung': 'Đối tượng sử dụng',
    'muihuong': 'Mùi hương',
    'domong': 'Độ mỏng',
    'doMem': 'Độ mềm',
    'quycachdonggoi': 'Quy cách đóng gói',
    'solansudung': 'Số lần sử dụng',
    'chieudaisudung': 'Chiều dài sử dụng',
    'phukien': 'Phụ kiện đi kèm',
    'chongthamuoc': 'Chống thắm nước',
    'nguonpin': 'Nguồn của pin',
    'tiengOn': 'Tiếng ồn',
    // Thêm các ánh xạ khác tại đây
  };
 // Hàm để tạo thông tin sản phẩm dựa vào từ điển ánh xạ
export default function getProductInformation(information) {
  const parsedInformation = parseInformation(information);
  let informationString = '';

  for (const key in parsedInformation) {
    if (parsedInformation[key]) {
      informationString += `<p><strong>${attributeMappings[key] || key}:</strong> ${parsedInformation[key]}</p>`;
    }
  }

  return informationString;
}

  // Hàm để phân tích thông tin sản phẩm từ JSON thành đối tượng
  export function parseInformation(information) {
    try {
      return JSON.parse(information);
    } catch (error) {
      return {};
    }
  }
  