import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function downPdf(pdfList:HTMLElement) {
    let target = pdfList;
    target.style.background = '#FFFFFF'
    html2canvas(target, {
      allowTaint: false,
      useCORS: true,
      height: pdfList.scrollHeight,//canvas高
      width: pdfList.scrollWidth,//canvas宽
      scale: 2
    }).then(function (canvas) {
      const contentWidth = canvas.width
			const contentHeight = canvas.height
      var pdfX = (contentWidth + 10) / 2 * 0.75
      var pdfY = (contentHeight + 500) / 2 * 0.75 // 500为底部留白
      var imgX = pdfX;
      var imgY = (contentHeight / 2 * 0.75); //内容图片这里不需要留白的距离
      const src = canvas.toDataURL('image/png',1.0);
      const pdf = new jsPDF('p', 'pt', [pdfX,pdfY])
      pdf.addImage(src, 'png', 0, 0, imgX, imgY)
      pdf.save('PDF存档.pdf')
    })
  
}