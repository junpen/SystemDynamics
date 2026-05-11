<template>
  <el-dialog
    v-model="editorStore.showHelpGuide"
    title="使用说明"
    width="780px"
    top="4vh"
    class="help-guide-dialog"
    destroy-on-close
  >
    <div class="help-guide">
      <!-- 侧边导航 -->
      <nav class="help-nav">
        <a
          v-for="sec in sections"
          :key="sec.id"
          :class="{ active: activeSection === sec.id }"
          @click="scrollTo(sec.id)"
        >{{ sec.title }}</a>
      </nav>

      <!-- 内容区 -->
      <div class="help-content" ref="contentRef" @scroll="updateActiveSection">
        <!-- 1. 系统简介 -->
        <section id="sec-intro">
          <h2>系统简介</h2>
          <p>
            <strong>系统动力学模拟器</strong> 是一个浏览器端的可视化建模工具，用于构建和运行系统动力学（System Dynamics）模型。
          </p>
          <p>
            你可以通过拖拽图元、连接关系、编写方程来描述一个复杂系统的运行规律，然后一键模拟，用图表观察系统随时间的变化趋势。
          </p>
          <div class="tip-box">
            <strong>典型应用场景：</strong>人口增长、疾病传播、供应链管理、军事资源配置、生态环境模拟、经济政策分析等。
          </div>
        </section>

        <!-- 2. 界面布局 -->
        <section id="sec-layout">
          <h2>界面布局</h2>
          <div class="layout-diagram">
            <div class="layout-row">
              <div class="layout-block header-block">顶部工具栏（运行 / 设置 / 保存 / 加载 / 导入 / 导出）</div>
            </div>
            <div class="layout-row layout-body">
              <div class="layout-block sidebar-block">
                左侧图元面板<br />
                <small>拖拽节点 / 选择连接线</small>
              </div>
              <div class="layout-block canvas-block">
                中间画布<br />
                <small>建模 &amp; 连线区域</small>
              </div>
              <div class="layout-block prop-block">
                右侧属性面板<br />
                <small>编辑选中元素的属性</small>
              </div>
            </div>
            <div class="layout-row">
              <div class="layout-block results-block">底部结果面板（运行后显示图表 / 数据表）</div>
            </div>
          </div>
        </section>

        <!-- 3. 基本操作流程 -->
        <section id="sec-workflow">
          <h2>基本操作流程</h2>
          <ol class="step-list">
            <li>
              <span class="step-num">1</span>
              <strong>添加图元</strong> — 从左侧面板拖拽「存量」「变量」「干预变量」「转换器」到画布
            </li>
            <li>
              <span class="step-num">2</span>
              <strong>命名元素</strong> — 点击画布上的元素，在右侧属性面板修改名称
            </li>
            <li>
              <span class="step-num">3</span>
              <strong>连接元素</strong> — 在左侧选择「流量」或「连接」工具，然后在画布上从一个节点拖线到另一个节点
            </li>
            <li>
              <span class="step-num">4</span>
              <strong>设置参数</strong> — 选中元素后在右侧属性面板填写初始值、方程、单位等
            </li>
            <li>
              <span class="step-num">5</span>
              <strong>配置模拟</strong> — 点击顶部「设置」按钮，配置算法、时间范围和步长
            </li>
            <li>
              <span class="step-num">6</span>
              <strong>运行模拟</strong> — 点击顶部绿色「运行」按钮，查看结果图表
            </li>
            <li>
              <span class="step-num">7</span>
              <strong>保存 / 导出</strong> — 使用顶部右侧按钮保存或导出模型
            </li>
          </ol>
        </section>

        <!-- 4. 图元类型详解 -->
        <section id="sec-elements">
          <h2>图元类型详解</h2>

          <div class="element-card stock">
            <div class="element-header">
              <span class="element-icon" style="background:#dbeafe;border-color:#3b82f6;color:#1e40af;">S</span>
              <h3>存量（Stock）</h3>
            </div>
            <p>表示系统中随时间<strong>积累</strong>的量，比如人口、资金、库存。</p>
            <ul>
              <li><strong>初始值</strong>：模拟开始时的数值（可以是一个数字或方程）</li>
              <li><strong>非负</strong>：勾选后值不会低于零</li>
              <li><strong>单位</strong>：可选设置，如"人"、"元"</li>
            </ul>
          </div>

          <div class="element-card variable">
            <div class="element-header">
              <span class="element-icon" style="background:#fef3c7;border-color:#f59e0b;color:#92400e;">V</span>
              <h3>变量（Variable）</h3>
            </div>
            <p>表示通过<strong>方程计算</strong>得到的辅助量，比如增长率、比率。</p>
            <ul>
              <li><strong>方程</strong>：使用 <code>[元素名]</code> 引用其他元素，如 <code>[人口] * [增长率]</code></li>
              <li>支持数学函数、条件判断、时间函数等（见下方方程语法说明）</li>
            </ul>
          </div>

          <div class="element-card intervariable">
            <div class="element-header">
              <span class="element-icon" style="background:#ccfbf1;border-color:#14b8a6;color:#115e59;">I</span>
              <h3>干预变量（Intervention Variable）</h3>
            </div>
            <p>表示<strong>外部干预措施</strong>对系统产生的影响，用于模拟不同政策或策略下的系统行为变化。</p>
            <ul>
              <li><strong>方程</strong>：定义干预的方式和强度，使用 <code>[元素名]</code> 引用其他元素</li>
              <li>与普通变量类似，但在对比分析中可独立标识为干预因素，便于区分系统内生变量与外部干预</li>
              <li><strong>单位</strong>：可选设置，如"%""人""元"</li>
            </ul>
          </div>

          <div class="element-card converter">
            <div class="element-header">
              <span class="element-icon" style="background:#ede9fe;border-color:#8b5cf6;color:#5b21b6;">C</span>
              <h3>转换器（Converter）</h3>
            </div>
            <p>表示<strong>非线性映射</strong>关系，通过数据点定义输入-输出对应表。</p>
            <ul>
              <li><strong>输入源</strong>：选择"时间"（以模拟时间为输入）或"元素"（以某个元素值为输入）</li>
              <li><strong>插值方式</strong>：线性插值（平滑过渡）或离散（阶梯变化）</li>
              <li><strong>数据点</strong>：手动添加 X-Y 对，系统会在中间自动插值</li>
            </ul>
          </div>

          <div class="sub-section">
            <h3>连接线类型</h3>
            <table class="info-table">
              <thead>
                <tr>
                  <th>类型</th>
                  <th>外观</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>流量（Flow）</strong></td>
                  <td><span style="color:#3b82f6;">━━━▶</span> 实线箭头</td>
                  <td>描述存量的<strong>流入/流出速率</strong>，需要一个速率方程。连接到"云朵 ☁"表示外部源/汇</td>
                </tr>
                <tr>
                  <td><strong>连接（Link）</strong></td>
                  <td><span style="color:#9ca3af;">╌╌╌▶</span> 虚线箭头</td>
                  <td>表示"引用"关系，把一个元素的信息传递给另一个元素。目标只能是存量、变量或流量</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="tip-box">
            <strong>云朵（Cloud ☁）</strong> 不是图元，而是当流量线没有明确来源/去向时自动产生的，代表"无限源"或"无限汇"。比如资金从外部流入，源头就会显示为云朵。
          </div>
        </section>

        <!-- 5. 方程语法 -->
        <section id="sec-equation">
          <h2>方程语法</h2>
          <p>在变量、流量的方程中使用以下语法引用其他元素和调用函数：</p>

          <h3>引用其他元素</h3>
          <p>用方括号包裹元素名称：<code>[元素名]</code></p>
          <div class="code-example">[人口] * [增长率]</div>
          <div class="code-example">[国防经费] + [经济总量] * 0.05</div>

          <h3>常用数学函数</h3>
          <table class="info-table fn-table">
            <thead>
              <tr><th>函数</th><th>说明</th><th>示例</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Round(x)</code></td><td>四舍五入</td><td>Round(3.7) = 4</td></tr>
              <tr><td><code>Abs(x)</code></td><td>绝对值</td><td>Abs(-5) = 5</td></tr>
              <tr><td><code>Sqrt(x)</code></td><td>平方根</td><td>Sqrt(16) = 4</td></tr>
              <tr><td><code>Max(a,b)</code></td><td>最大值</td><td>Max(3, 7) = 7</td></tr>
              <tr><td><code>Min(a,b)</code></td><td>最小值</td><td>Min(3, 7) = 3</td></tr>
              <tr><td><code>Exp(x)</code></td><td>e 的 x 次方</td><td>Exp(1) = 2.718...</td></tr>
              <tr><td><code>Log(x)</code></td><td>对数（底数10）</td><td>Log(100) = 2</td></tr>
              <tr><td><code>Sin(x), Cos(x)</code></td><td>三角函数</td><td>Cos(0) = 1</td></tr>
            </tbody>
          </table>

          <h3>时间函数</h3>
          <table class="info-table fn-table">
            <thead>
              <tr><th>函数</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Time()</code></td><td>当前模拟时间</td></tr>
              <tr><td><code>Years()</code></td><td>当前时间（以年为单位）</td></tr>
              <tr><td><code>Days()</code></td><td>当前时间（以天为单位）</td></tr>
              <tr><td><code>Seasonal(Peak=0)</code></td><td>周期性正弦波（1年周期）</td></tr>
            </tbody>
          </table>

          <h3>条件与控制</h3>
          <table class="info-table fn-table">
            <thead>
              <tr><th>函数</th><th>说明</th><th>示例</th></tr>
            </thead>
            <tbody>
              <tr><td><code>IfThenElse(cond, a, b)</code></td><td>条件判断</td><td>IfThenElse([x] > 10, 1, 0)</td></tr>
              <tr><td><code>Pulse(t, h, w, r)</code></td><td>脉冲</td><td>在时间 t 产生高度 h 的脉冲</td></tr>
              <tr><td><code>Step(t, h)</code></td><td>阶跃</td><td>从时间 t 开始输出高度 h</td></tr>
              <tr><td><code>Ramp(start, end)</code></td><td>斜坡</td><td>从 start 到 end 线性增长到 1</td></tr>
            </tbody>
          </table>

          <div class="tip-box">
            在方程编辑器中，下方会显示可用的<strong>变量标签</strong>（绿色标签），点击即可快速插入。也可以展开「函数」面板查看所有可用函数。
          </div>
        </section>

        <!-- 6. 模拟设置 -->
        <section id="sec-simulation">
          <h2>模拟设置</h2>
          <p>点击顶部工具栏的「设置」按钮，打开模型设置对话框：</p>
          <table class="info-table">
            <thead>
              <tr><th>参数</th><th>说明</th><th>建议值</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>模型名称</strong></td>
                <td>为你的模型取一个名字</td>
                <td>随意</td>
              </tr>
              <tr>
                <td><strong>求解算法</strong></td>
                <td>
                  <strong>欧拉法（RK1）</strong>：速度快、精度较低<br/>
                  <strong>龙格-库塔法（RK4）</strong>：速度较慢、精度高（推荐）
                </td>
                <td>RK4</td>
              </tr>
              <tr>
                <td><strong>起始时间</strong></td>
                <td>模拟从哪个时刻开始</td>
                <td>0</td>
              </tr>
              <tr>
                <td><strong>模拟时长</strong></td>
                <td>模拟运行多长时间</td>
                <td>取决于模型</td>
              </tr>
              <tr>
                <td><strong>时间步长</strong></td>
                <td>每次计算的时间间隔，越小越精确但越慢</td>
                <td>0.5 或 0.25</td>
              </tr>
              <tr>
                <td><strong>时间单位</strong></td>
                <td>秒 / 分 / 时 / 天 / 周 / 月 / 年</td>
                <td>取决于模型</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 7. 查看结果 -->
        <section id="sec-results">
          <h2>查看结果</h2>
          <p>点击「运行」按钮后，底部会自动打开结果面板。点击顶部的「结果」按钮可以随时切换显示/隐藏。</p>

          <h3>图表视图</h3>
          <ul>
            <li>以折线图展示各元素随时间的变化趋势</li>
            <li>支持鼠标滚轮缩放、拖拽平移</li>
            <li>图例可以点击来显示/隐藏特定元素的曲线</li>
          </ul>

          <h3>数据表视图</h3>
          <ul>
            <li>以表格形式展示每个时间步的精确数值</li>
          </ul>
        </section>

        <!-- 8. 保存与加载 -->
        <section id="sec-save">
          <h2>保存、加载与导入导出</h2>
          <table class="info-table">
            <thead>
              <tr><th>操作</th><th>按钮位置</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>保存</strong></td>
                <td>顶部工具栏右侧</td>
                <td>将模型保存到服务器，下次可以加载。模型修改后标题旁会出现「未保存」标记</td>
              </tr>
              <tr>
                <td><strong>加载</strong></td>
                <td>顶部工具栏右侧</td>
                <td>从服务器加载已保存的模型，也可以浏览示例模型</td>
              </tr>
              <tr>
                <td><strong>导出</strong></td>
                <td>顶部工具栏右侧</td>
                <td>将当前模型下载为 <code>.json</code> 文件到本地</td>
              </tr>
              <tr>
                <td><strong>导入</strong></td>
                <td>顶部工具栏右侧</td>
                <td>从本地上传 <code>.json</code> 文件恢复模型</td>
              </tr>
              <tr>
                <td><strong>示例</strong></td>
                <td>顶部工具栏中间</td>
                <td>浏览系统预置的示例模型，点击即可加载</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 9. 画布操作 -->
        <section id="sec-canvas">
          <h2>画布操作技巧</h2>
          <table class="info-table">
            <thead>
              <tr><th>操作</th><th>方式</th></tr>
            </thead>
            <tbody>
              <tr><td>添加节点</td><td>从左侧面板拖拽到画布</td></tr>
              <tr><td>连接节点</td><td>先在左侧选择连接线类型，然后从一个节点端口拖到另一个节点</td></tr>
              <tr><td>选中元素</td><td>左键点击元素</td></tr>
              <tr><td>移动节点</td><td>左键拖拽节点</td></tr>
              <tr><td>创建分组</td><td>框选多个节点后，右键选择「创建分组」，输入名称并选择颜色即可将多个元素归入一个可视化分组</td></tr>
              <tr><td>折叠 / 展开分组</td><td>右键分组，选择「折叠分组」或「展开分组」来切换分组的显示状态</td></tr>
              <tr><td>重命名分组</td><td>右键分组，选择「重命名分组」修改分组名称</td></tr>
              <tr><td>取消分组</td><td>右键分组，选择「取消分组」将分组内的节点恢复为独立状态</td></tr>
              <tr><td>删除元素</td><td>选中后按 <kbd>Delete</kbd> 键，或右键菜单「删除」</td></tr>
              <tr><td>复制 / 粘贴</td><td>右键元素，选择「复制」，再在空白处右键「粘贴」</td></tr>
              <tr><td>反转连接线方向</td><td>右键连接线，选择「反转方向」</td></tr>
              <tr><td>添加 +/- 标注</td><td>右键连接线，选择「起始标注 + 」或「结束标注 -」等</td></tr>
              <tr><td>缩放画布</td><td><kbd>Ctrl</kbd> + 鼠标滚轮</td></tr>
              <tr><td>平移画布</td><td>左键拖拽空白区域</td></tr>
              <tr><td>撤销</td><td><kbd>Ctrl</kbd> + <kbd>Z</kbd></td></tr>
              <tr><td>清空画布</td><td>画布上方工具栏「清空画布」按钮</td></tr>
            </tbody>
          </table>
        </section>

        <!-- 10. 快速上手示例 -->
        <section id="sec-quickstart">
          <h2>快速上手：5 分钟创建你的第一个模型</h2>
          <p>我们创建一个简单的「银行存款增长模型」：</p>

          <div class="step-card">
            <div class="step-num">1</div>
            <div>
              <strong>添加一个存量</strong>：拖拽「存量」到画布，命名为 <code>存款</code>，初始值设为 <code>10000</code>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div>
              <strong>添加一个变量</strong>：拖拽「变量」到画布，命名为 <code>年利率</code>，方程设为 <code>0.05</code>（即 5%）
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div>
              <strong>添加一个流量</strong>：选择左侧「流量」工具，从空白处拖线到「存款」节点，命名为 <code>利息收入</code>，速率方程设为 <code>[存款] * [年利率]</code>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">4</div>
            <div>
              <strong>连接引用</strong>：选择左侧「连接」工具，从「年利率」拖线到「利息收入」，从「存款」拖线到「利息收入」
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">5</div>
            <div>
              <strong>运行</strong>：点击顶部「设置」，确认时间为 0~20 年，步长 0.5，算法 RK4。然后点击绿色「运行」按钮
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">6</div>
            <div>
              <strong>查看结果</strong>：底部图表会显示存款随时间呈指数增长的趋势。切换到「数据表」可以查看具体数值。
            </div>
          </div>

        </section>

        <!-- 11. 常见问题 -->
        <section id="sec-faq">
          <h2>常见问题</h2>

          <div class="faq-item">
            <h4>Q：模拟运行报错怎么办？</h4>
            <p>A：常见原因：</p>
            <ul>
              <li>方程中引用了不存在的元素名（检查拼写是否与元素名完全一致）</li>
              <li>流量没有设置速率方程</li>
              <li>存在循环引用（A 引用 B，B 又引用 A）</li>
              <li>方程语法有误（括号不匹配、使用了不支持的运算符等）</li>
            </ul>
          </div>

          <div class="faq-item">
            <h4>Q：流量线的起点/终点为什么出现云朵？</h4>
            <p>A：云朵表示"外部源"或"外部汇"。如果流量从空白处开始或结束，就会产生云朵。如果流量连接两个存量，则不会出现云朵。</p>
          </div>

          <div class="faq-item">
            <h4>Q：变量不能作为流量线的起点？</h4>
            <p>A：这是系统的设计规则。流量描述的是存量的流入/流出，必须从存量或空白处（云朵）开始。如果要引用变量的值，请使用「连接」线将变量连接到流量。</p>
          </div>

          <div class="faq-item">
            <h4>Q：连接线（Link）和流量线（Flow）有什么区别？</h4>
            <p>A：<strong>流量线</strong>改变存量的值（有速率方程）；<strong>连接线</strong>只是传递信息引用（没有速率方程）。简单记忆：流量 = 动作，连接 = 引用。</p>
          </div>

          <div class="faq-item">
            <h4>Q：如何让模型结果更准确？</h4>
            <p>A：尝试以下方法：</p>
            <ul>
              <li>使用 RK4 算法代替欧拉法</li>
              <li>减小时间步长（如从 1 改为 0.25）</li>
              <li>增加模拟时长以观察长期趋势</li>
            </ul>
          </div>

          <div class="faq-item">
            <h4>Q：如何理解转换器的数据点？</h4>
            <p>A：转换器类似 Excel 中的查找表。例如设置数据点 (0, 0)、(50, 0.5)、(100, 1)，表示当输入为 0 时输出 0，输入 50 时输出 0.5，输入 100 时输出 1。中间值会自动插值计算。</p>
          </div>
        </section>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useEditorStore } from '../../stores/editor.js';

const editorStore = useEditorStore();
const contentRef = ref(null);
const activeSection = ref('sec-intro');
const sectionIds = [
  'sec-intro', 'sec-layout', 'sec-workflow', 'sec-elements', 'sec-equation',
  'sec-simulation', 'sec-results', 'sec-save', 'sec-canvas', 'sec-quickstart', 'sec-faq',
];
const sections = [
  { id: 'sec-intro', title: '系统简介' },
  { id: 'sec-layout', title: '界面布局' },
  { id: 'sec-workflow', title: '操作流程' },
  { id: 'sec-elements', title: '图元详解' },
  { id: 'sec-equation', title: '方程语法' },
  { id: 'sec-simulation', title: '模拟设置' },
  { id: 'sec-results', title: '查看结果' },
  { id: 'sec-save', title: '保存加载' },
  { id: 'sec-canvas', title: '画布技巧' },
  { id: 'sec-quickstart', title: '快速上手' },
  { id: 'sec-faq', title: '常见问题' },
];

let isScrollingTo = false;

function updateActiveSection() {
  if (isScrollingTo || !contentRef.value) return;
  const containerTop = contentRef.value.getBoundingClientRect().top;
  let current = sectionIds[0];
  for (const id of sectionIds) {
    const el = contentRef.value.querySelector(`#${id}`);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= containerTop + 40) {
      current = id;
    }
  }
  activeSection.value = current;
}

function scrollTo(id) {
  activeSection.value = id;
  isScrollingTo = true;
  nextTick(() => {
    const el = contentRef.value?.querySelector(`#${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => { isScrollingTo = false; }, 600);
  });
}
</script>

<style scoped>
.help-guide {
  display: flex;
  gap: 0;
  min-height: 520px;
  max-height: 72vh;
}

/* 侧边导航 */
.help-nav {
  width: 140px;
  min-width: 140px;
  border-right: 1px solid var(--border-color, #e2e6ef);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 0;
  align-self: flex-start;
}

.help-nav a {
  display: block;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--text-secondary, #5a6178);
  cursor: pointer;
  border-right: 3px solid transparent;
  transition: all 0.15s;
  text-decoration: none;
  white-space: nowrap;
}

.help-nav a:hover {
  color: var(--accent-blue, #4f6ef7);
  background: #f0f2ff;
}

.help-nav a.active {
  color: var(--accent-indigo, #6366f1);
  font-weight: 600;
  border-right-color: var(--accent-indigo, #6366f1);
  background: #eef0ff;
}

/* 内容区 */
.help-content {
  flex: 1;
  padding: 8px 24px 24px;
  overflow-y: auto;
  max-height: 72vh;
  scroll-behavior: smooth;
}

.help-content h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #1e2433);
  margin: 28px 0 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--accent-indigo, #6366f1);
}

.help-content h2:first-child {
  margin-top: 0;
}

.help-content h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #1e2433);
  margin: 18px 0 8px;
}

.help-content p {
  font-size: 14px;
  color: var(--text-secondary, #5a6178);
  line-height: 1.7;
  margin: 6px 0;
}

.help-content ul {
  padding-left: 20px;
  margin: 6px 0;
}

.help-content li {
  font-size: 14px;
  color: var(--text-secondary, #5a6178);
  line-height: 1.7;
  margin: 3px 0;
}

code {
  background: #f0f2ff;
  color: var(--accent-indigo, #6366f1);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
}

kbd {
  background: var(--bg-panel, #f7f8fc);
  border: 1px solid var(--border-color, #e2e6ef);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  font-family: inherit;
  box-shadow: 0 1px 1px rgba(0,0,0,0.06);
}

/* 布局示意图 */
.layout-diagram {
  background: var(--bg-panel, #f7f8fc);
  border: 1px solid var(--border-color, #e2e6ef);
  border-radius: 10px;
  padding: 12px;
  margin: 12px 0;
}

.layout-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.layout-row:last-child {
  margin-bottom: 0;
}

.layout-block {
  border-radius: 8px;
  padding: 10px 12px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #5a6178);
  line-height: 1.5;
}

.layout-block small {
  display: block;
  font-weight: 400;
  color: var(--text-muted, #9299ad);
  margin-top: 2px;
}

.header-block {
  background: #d1d5f0;
  flex: 1;
}

.layout-body {
  min-height: 80px;
}

.sidebar-block {
  background: #fef3c7;
  flex: 0 0 120px;
}

.canvas-block {
  background: #dbeafe;
  flex: 1;
}

.prop-block {
  background: #ede9fe;
  flex: 0 0 140px;
}

.results-block {
  background: #d1fae5;
  flex: 1;
}

/* 操作步骤 */
.step-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.step-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light, #eef0f6);
  font-size: 14px;
  color: var(--text-secondary, #5a6178);
  line-height: 1.6;
}

.step-list li:last-child {
  border-bottom: none;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  background: var(--accent-indigo, #6366f1);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

/* 图元卡片 */
.element-card {
  border: 1px solid var(--border-color, #e2e6ef);
  border-radius: 10px;
  padding: 14px 16px;
  margin: 10px 0;
  background: var(--bg-card, #fff);
}

.element-card.stock {
  border-left: 4px solid #3b82f6;
}

.element-card.variable {
  border-left: 4px solid #f59e0b;
}

.element-card.intervariable {
  border-left: 4px solid #14b8a6;
}

.element-card.converter {
  border-left: 4px solid #8b5cf6;
}

.element-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.element-header h3 {
  margin: 0 !important;
}

.element-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
}

.sub-section {
  margin: 16px 0;
}

/* 表格 */
.info-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 13px;
}

.info-table th {
  background: var(--bg-panel, #f7f8fc);
  padding: 8px 10px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary, #1e2433);
  border-bottom: 2px solid var(--border-color, #e2e6ef);
}

.info-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-light, #eef0f6);
  color: var(--text-secondary, #5a6178);
  vertical-align: top;
  line-height: 1.6;
}

.info-table tr:last-child td {
  border-bottom: none;
}

.fn-table td:first-child {
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: nowrap;
}

/* 代码示例 */
.code-example {
  background: #1e2433;
  color: #e2e8f0;
  padding: 8px 14px;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  margin: 6px 0;
  line-height: 1.5;
}

/* 步骤卡片（快速上手） */
.step-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin: 8px 0;
  background: var(--bg-panel, #f7f8fc);
  border-radius: 8px;
  border: 1px solid var(--border-light, #eef0f6);
}

.step-card .step-num {
  margin-top: 2px;
}

.step-card div:last-child {
  font-size: 14px;
  color: var(--text-secondary, #5a6178);
  line-height: 1.7;
}

/* 提示框 */
.tip-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 14px;
  margin: 12px 0;
  font-size: 13px;
  color: #1e40af;
  line-height: 1.6;
}

.tip-box.success {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
}

/* FAQ */
.faq-item {
  margin: 12px 0;
  padding: 12px 14px;
  background: var(--bg-panel, #f7f8fc);
  border-radius: 8px;
  border: 1px solid var(--border-light, #eef0f6);
}

.faq-item h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-indigo, #6366f1);
  margin-bottom: 6px;
}

.faq-item p,
.faq-item li {
  font-size: 13px;
  color: var(--text-secondary, #5a6178);
  line-height: 1.7;
}

/* 对话框全局样式 */
:deep(.el-dialog__body) {
  padding: 0 !important;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--border-color, #e2e6ef);
  padding: 14px 20px;
}

:deep(.el-dialog__headerbtn) {
  top: 14px;
}
</style>
