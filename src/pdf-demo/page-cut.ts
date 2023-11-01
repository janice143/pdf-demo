/** a4纸的尺寸[595.28,841.89], 单位毫米 */
const [PAGE_WIDTH, PAGE_HEIGHT] = [595.28, 841.89];

const PAPER_CONFIG = {
  /** 竖向 */
  portrait: {
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH,
    contentWidth: 560
  },
  /** 横向 */
  landscape: {
    height: PAGE_WIDTH,
    width: PAGE_HEIGHT,
    contentWidth: 800
  }
};

/**
 * 生成pdf(A4多页pdf截断问题， 包括页眉、页脚 和 上下左右留空的护理)
 * @param param0
 * @returns
 */
export async function outputPDF({
  /** pdf内容的dom元素 */
  element,

  /** 页脚dom元素 */
  footer,

  /** 页眉dom元素 */
  header,

  /** pdf文件名 */
  filename,

  /** a4值的方向: portrait or landscape */
  orientation = 'portrait' as 'portrait' | 'landscape',

  /** 渲染页脚的逻辑 */
  renderFooter = (cur: number, sum: number) => true
}) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  if (!['portrait', 'landscape'].includes(orientation)) {
    return Promise.reject(
      new Error(
        `Invalid Parameters: the parameter {orientation} is assigned wrong value, you can only assign it with {portrait} or {landscape}`
      )
    );
  }
  const [A4_WIDTH, A4_HEIGHT] = [
    PAPER_CONFIG[orientation].width,
    PAPER_CONFIG[orientation].height
  ];

  const tFooterHeight = 0;
  const tHeaderHeight = 0;

  /** 一页pdf的内容宽度, 左右预设留白 */
  const { contentWidth } = PAPER_CONFIG[orientation];

  // 距离PDF左边的距离，/ 2 表示居中
  const baseX = (A4_WIDTH - contentWidth) / 2; // 预留空间给左边
  // 距离PDF 页眉和页脚的间距， 留白留空
  const baseY = 15;

  // 除去页头、页眉、还有内容与两者之间的间距后 每页内容的实际高度
  const originalPageHeight =
    A4_HEIGHT - tFooterHeight - tHeaderHeight - 2 * baseY;

  // 元素在网页页面的宽度
  const elementWidth = element.offsetWidth;

  // PDF内容宽度 和 在HTML中宽度 的比， 用于将 元素在网页的高度 转化为 PDF内容内的高度， 将 元素距离网页顶部的高度  转化为 距离Canvas顶部的高度
  const rate = contentWidth / elementWidth;

  // 每一页的分页坐标， PDF高度， 初始值为根元素距离顶部的距离
  const pages = [rate * getElementTop(element)];

  // 获取该元素到页面顶部的高度(注意滑动scroll会影响高度)
  function getElementTop(contentElement) {
    if (contentElement.getBoundingClientRect) {
      const rect = contentElement.getBoundingClientRect() || {};
      const topDistance = rect.top;

      return topDistance;
    }
  }

  // 遍历正常的元素节点
  function traversingNodes(nodes) {
    for (let i = 0; i < nodes.length; ++i) {
      const one = nodes[i];

      /** */
      /** 注意： 可以根据业务需求，判断其他场景的分页，本代码只判断表格的分页场景 */
      /** */

      // table的每一行元素也是深度终点
      const isTableCol =
        one.classList && one.classList.contains('ant4-table-row');

      // 对需要处理分页的元素，计算是否跨界，若跨界，则直接将顶部位置作为分页位置，进行分页，且子元素不需要再进行判断
      const { offsetHeight } = one;
      // 计算出最终高度
      const offsetTop = getElementTop(one);

      // dom转换后距离顶部的高度
      // 转换成canvas高度
      const top = rate * offsetTop;
      const rateOffsetHeight = rate * offsetHeight;

      // 对于深度终点元素进行处理
      if (isTableCol) {
        // dom高度转换成生成pdf的实际高度
        // 代码不考虑dom定位、边距、边框等因素，需在dom里自行考虑，如将box-sizing设置为border-box
        updatePos(rateOffsetHeight, top);
      }
      // 对于普通元素，则判断是否高度超过分页值，并且深入
      else {
        // 执行位置更新操作
        updateNormalElPos(top);
        // 遍历子节点
        traversingNodes(one.childNodes);
      }
    }
  }

  // 普通元素更新位置的方法
  // 普通元素只需要考虑到是否到达了分页点，即当前距离顶部高度 - 上一个分页点的高度 大于 正常一页的高度，则需要载入分页点
  function updateNormalElPos(top) {
    if (
      top - (pages.length > 0 ? pages[pages.length - 1] : 0) >=
      originalPageHeight
    ) {
      pages.push(
        (pages.length > 0 ? pages[pages.length - 1] : 0) + originalPageHeight
      );
    }
  }

  // 可能跨页元素位置更新的方法
  // 需要考虑分页元素，则需要考虑两种情况
  // 1. 普通达顶情况，如上
  // 2. 当前距离顶部高度加上元素自身高度 大于 整页高度，则需要载入一个分页点
  function updatePos(eHeight: number, top: number) {
    // 如果高度已经超过当前页，则证明可以分页了
    if (
      top - (pages.length > 0 ? pages[pages.length - 1] : 0) >=
      originalPageHeight
    ) {
      pages.push(
        (pages.length > 0 ? pages[pages.length - 1] : 0) + originalPageHeight
      );
    }
    // 若 距离当前页顶部的高度 加上元素自身的高度 大于 一页内容的高度, 则证明元素跨页，将当前高度作为分页位置
    else if (
      top + eHeight - (pages.length > 0 ? pages[pages.length - 1] : 0) >
        originalPageHeight &&
      top !== (pages.length > 0 ? pages[pages.length - 1] : 0)
    ) {
      pages.push(top);
    }
  }

  // 深度遍历节点的方法
  traversingNodes(element.childNodes);

  // 此处逻辑可能有问题：会出现空白页
  // 可能会存在遍历到底部元素为深度节点，可能存在最后一页位置未截取到的情况
  // if (pages[pages.length - 1] + originalPageHeight < height) {
  //   pages.push(pages[pages.length - 1] + originalPageHeight);
  // }
  // console.log({ pages, contentWidth, width,height })

  // 对pages进行一个值的修正，因为pages生成是根据根元素来的，根元素并不是我们实际要打印的元素，而是element，
  // 所以要把它修正，让其值是以真实的打印元素顶部节点为准
  const newPages = pages.map((item) => item - pages[0]);

  // 根据分页位置 开始分页
  for (let i = 0; i < newPages.length; ++i) {
    // 若不是最后一页，则分页
    if (i !== newPages.length - 1) {
      // 增加分页
      addPage(baseY + tHeaderHeight - newPages[i]);
    }
  }

  function addPage(pos) {
    // element
    console.log('pos', pos);
  }
  // return pdf.save(filename);
}
