class Gauge {
  constructor({ dom }) {
    this.ctx = dom.getContext("2d");
    this.circleX = dom.width / 2; // 中心x坐标
    this.circleY = 150; //中心y坐标
  }
  /**
   * 画纯色圆环
   * @param r {number} 圆环的半径
   * @param w {number} 圆环的宽度
   * @param c {string} 圆环的颜色
   * @param angleBegin {number} 圆环起始的角度 默认0度
   * @param angleEnd {number} 圆环所到的角度 默认180度
   */
  monochromeCircle(r, w, c, angleBegin = 0, angleEnd = 180) {
    let ctx = this.ctx;
    // 画布将当前的状态保存
    // canvas.save();与canvas.restore();一般结合使用，.save()函数在前，.restore()函数在后，
    // 用来保证在这两个函数之间所做的操作不会对原来在canvas上所画图形产生影响
    ctx.save();
    // 开始一条路径，或重置当前的路径
    ctx.beginPath();
    // 设置线条的宽度
    ctx.lineWidth = w;
    // 设置线条的颜色
    ctx.strokeStyle = c;
    // 方法创建弧/曲线（用于创建圆或部分圆）
    ctx.arc(
      this.circleX,
      this.circleY,
      r,
      Math.PI * (1 + angleBegin / 180),
      Math.PI * (1 + angleEnd / 180)
    );
    ctx.stroke();
    // 画布取出原来所保存的状态
    ctx.restore();
  }

  /**
   * 画渐变圆环
   * @param r {number} 圆环的半径
   * @param w {number} 圆环的E宽度
   * @param cB {string} 圆环开始的颜色
   * @param cE {string} 圆环结束的颜色
   * @param angleBegin {number} 圆环起始的角度 默认0度
   * @param angleEnd {number} 圆环所到的角度 默认180度
   */
  linearCircle(r, w, cB, cE, angleBegin = 0, angleEnd = 180) {
    let ctx = this.ctx;
    // 设置线条的颜色
    const startColorArr = this.hexToArr(cB);
    const endColorArr = this.hexToArr(cE);
    let diffR = endColorArr[0] - startColorArr[0];
    let diffG = endColorArr[1] - startColorArr[1];
    let diffB = endColorArr[2] - startColorArr[2];
    for (let i = angleBegin; i < angleEnd; i++) {
      // 画布将当前的状态保存
      // canvas.save();与canvas.restore();一般结合使用，.save()函数在前，.restore()函数在后，
      // 用来保证在这两个函数之间所做的操作不会对原来在canvas上所画图形产生影响
      ctx.save();
      // 开始一条路径，或重置当前的路径
      ctx.beginPath();
      // 设置线条的宽度
      ctx.lineWidth = w;
      let hex = this.rgbToHex(
        startColorArr[0] +
          Math.floor((diffR * (i - angleBegin)) / (angleEnd - angleBegin)),
        startColorArr[1] +
          Math.floor((diffG * (i - angleBegin)) / (angleEnd - angleBegin)),
        startColorArr[2] +
          Math.floor((diffB * (i - angleBegin)) / (angleEnd - angleBegin))
      );
      ctx.strokeStyle =
        "#" +
        (hex.length === 4 ? "00" + hex : hex.length === 5 ? "0" + hex : hex);
      // 方法创建弧/曲线（用于创建圆或部分圆）
      ctx.arc(
        this.circleX,
        this.circleY,
        r,
        Math.PI * (i / 180),
        Math.PI * ((i + 1) / 180)
      );
      ctx.stroke();
      ctx.closePath();
      // 画布取出原来所保存的状态
      ctx.restore();
    }
  }
  hexToArr(hex) {
    let reg = /^#([0-9a-fA-f]{4}|[0-9a-fA-f]{6})$/;
    let _color = hex.toLowerCase();
    if (_color && reg.test(_color)) {
      // 处理四位颜色值
      if (_color.length === 4) {
        let _colorTemp = "#";
        for (let i = 1; i < 4; i++) {
          _colorTemp += _color.slice(i, i + 1).concat(_color.slice(i, i + 1));
        }
        _color = _colorTemp;
      }

      // 处理六位颜色值
      let _colorArr = [];
      for (let i = 1; i < 7; i += 2) {
        _colorArr.push(parseInt("0x" + _color.slice(i, i + 2)));
      }
      return _colorArr;
    } else {
      return _color;
    }
  }
  hexToRgb(hex) {}
  rgbToHex(r, g, b) {
    return ((r << 16) + (g << 8) + b).toString(16);
  }

  /**
   * 绘制刻度线
   * @param s {number}  弧度所对应的角度
   * @param span {number}  弧度间隔
   * @param sl {number}  刻度线以圆心为半径的起始半径
   * @param el {number}  刻度线以圆心为半径的结束半径
   * @param c {string}  刻度线的颜色
   */
  scale(s, span, sl, el, c) {
    let ctx = this.ctx;
    let startA = s;
    for (let i = 0; i < span; i++) {
      ctx.save();
      ctx.beginPath();
      let rad = (startA * 45 * Math.PI) / 180;
      let startX = 200 - Math.cos(rad) * sl;
      let startY = 150 - Math.sin(rad) * sl;
      let endX = 200 - Math.cos(rad) * el;
      let endY = 150 - Math.sin(rad) * el;
      // 路径移动到画布中的指定点，不创建线条
      ctx.moveTo(startX, startY);
      // 添加一个新点，然后创建从该点到画布中最后指定点的线条（该方法并不会创建线条）
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = c;
      // 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
      ctx.stroke();
      ctx.restore();
      startA++;
    }
  }
  /**
   * 绘制文字
   * @param text {string}  文字的内容
   * @param x {number}  文字的x坐标轴
   * @param y {number}  文字的y坐标轴
   * @param c {string}  刻度线的颜色
   * @param fontSize {string}  刻度线以圆心为半径的结束半径
   */
  fillText(text, x, y, color = "#333", fontSize = "18", align = "center") {
    let ctx = this.ctx;
    ctx.save();
    // 根据锚点，设置或返回文本内容的当前对齐方式    水平方向
    ctx.textAlign = align;
    // 设置或返回在绘制文本时的当前文本基线    垂直方向
    ctx.textBaseline = "middle";
    // 设置或返回画布上文本内容的当前字体属性
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = color;
    // 在画布上绘制填色的文本
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * 绘制圆
   * @param x {number} 圆心的x坐标轴
   * @param y {number} 圆心的y坐标轴
   * @param r {number} 圆的半径
   * @param fillColor {string} 圆所填充的颜色
   * @param lineWidth {number} 圆的宽度
   */
  round(x, y, r, fillColor = "#fff", lineWidth = 0) {
    let ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    if (lineWidth) ctx.strokeStyle = "#7775FD";
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fillStyle = fillColor;
    // 填充当前的图像（路径）。默认颜色是黑色
    ctx.fill();
    if (lineWidth) ctx.stroke();
    ctx.restore();
  }

  /**
   * 画三角形
   * @param angle {number}  弧度所对应的角度
   */
  triangle(angle, h, c) {
    let ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    let rad = (angle * Math.PI) / 180;
    let startX = this.circleX - Math.cos(rad) * h;
    let startY = this.circleY - Math.sin(rad) * h;
    ctx.moveTo(startX, startY);
    let rad1 = ((90 - angle) * Math.PI) / 180;
    let startX1 = this.circleX - Math.cos(rad1) * 3;
    let startY1 = this.circleY + Math.sin(rad1) * 3;
    ctx.lineTo(startX1, startY1);
    let rad2 = ((90 - angle) * Math.PI) / 180;
    let startX2 = this.circleX + Math.cos(rad2) * 3;
    let startY2 = this.circleY - Math.sin(rad2) * 3;
    ctx.lineTo(startX2, startY2);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.strokeStyle = c;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 绘制图形
   * @param angle {object}  角度
   */
  draw(companyAngle, industryAngle) {
    this.ctx.clearRect(0, 0, this.circleX * 2, this.circleY * 2);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, 400, 400);
    this.ctx.fillStyle = "#1b222d";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    this.linearCircle(80, 12, "#e64440", "#e0762c", 180, 225);
    this.linearCircle(80, 12, "#e0762c", "#eeb219", 225, 270);
    this.linearCircle(80, 12, "#eeb219", "#85b64a", 270, 315);
    this.linearCircle(80, 12, "#85b64a", "#2dc97e", 315, 360);
    this.monochromeCircle(80, 12, "#803136", -45, 0);
    this.monochromeCircle(80, 12, "#237655", 180, 225);
    this.scale(0, 5, 74, 86, "#000000");
    this.fillText("0%", 100, 150, "#FFFFFF", "12");
    this.fillText("10.0%", 120, 80, "#FFFFFF", "12");
    this.fillText("20.0%", 200, 55, "#FFFFFF", "12");
    this.fillText("30.0%", 280, 80, "#FFFFFF", "12");
    this.fillText("40.0%", 310, 150, "#FFFFFF", "12");
    this.fillText("Future ROE(3yrs)", 200, 210, "#FFFFFF", "12");
    this.fillText("Company", 177, 225, "#2189ce", "12");
    this.fillText("132.1%", 252, 225, "#2189ce", "12", "right");
    this.fillText("Industry", 172, 240, "#6fe3d2", "11");
    this.fillText("11.2%", 250, 240, "#6fe3d2", "11", "right");
    this.round(200, 150, 10, "#484e57");
    // industry
    this.drawPointerAndCircle("#23363e", 40, industryAngle, "#2394df", 45);
    // company
    this.drawPointerAndCircle("#1b2d3f", 60, companyAngle, "#71e7d6", 65);
  }

  drawPointerAndCircle(circleColor, circleR, angle, pointerColor, pointerR) {
    this.monochromeCircle(circleR, 12, circleColor, 0, angle);
    this.triangle(angle, pointerR, pointerColor);
    this.round(200, 150, 6, pointerColor);
  }

  start({ companyAngle, industryAngle, duration = 0 }) {
    if (duration > 0) {
      this.companyAngle = companyAngle;
      this.industryAngle = industryAngle;
      this.animate(duration);
    } else {
      this.draw(companyAngle, industryAngle);
    }
  }

  animate(duration) {
    var tempCompanyAngle = 0;
    var tempIndustryAngle = 0;
    const animateTimer = setInterval(() => {
      tempCompanyAngle += (this.companyAngle / duration) * 20;
      tempIndustryAngle += (this.industryAngle / duration) * 20;
      if (tempCompanyAngle >= this.companyAngle) {
        clearInterval(animateTimer);
        return;
      }
      this.draw(tempCompanyAngle, tempIndustryAngle);
    }, 20);
  }
}
