# React组件库

致力于在web移动端实现原生APP操作体验的React组件库

### 安装
``` bash
npm i vin-rc -S
```

### 引入样式文件
``` js
import 'vin-rc/lib/index.css';
```

### 1. 抽屉
类似于高德地图中点击一个地物后从底部弹出的详情面板，可向上拖动展开，也可向下滑动收起。

![抽屉演示](https://github.com/Vince-9/vin-rc/blob/main/docs/imgs/draw.gif)

使用方法：
``` js
import { Draw } from 'vin-rc';

  const [drawVisiable, setDrawVisiable] = useState(false);

  return (
      <Draw
        visiable={drawVisiable}
        onClose={() => setDrawVisiable(false)}
      >
        <div>
          <p>这是里面的内容</p>
          <p>添加更多内容来滚动试试吧</p>
        </div>
      </Draw>
  );
```

#### API
`minHeight : number`: 组件处于最低位置时的高度，为视口高度百分比，如30就是30%

`maxHeight : number`: 组件处于最高位置时的高度

`visiable : boolean`: 是否可见

`onClose : () => void`: 当触发收起操作时的回调
