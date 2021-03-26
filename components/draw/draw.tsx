import * as React from 'react';
import './style';

export interface DrawProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  visiable?: boolean;
  onClose?: () => void;
  minHeight?: number;
  maxHeight?: number;
}

const viewHeight = window.innerHeight;
// const maxHeight = (viewHeight - 50) / viewHeight * 100;

/**
 * 这是一个可上下拖动来控制其高度的组件，类似在高德地图APP中点击一个点后弹出的详情
 */
export default function Draw(props: DrawProps) {

  const {
    children,
    visiable = false,
    minHeight = 30,
    maxHeight = Math.round((viewHeight - 50) / viewHeight * 100),
    onClose,
    className = '',
    style = {},
  } = props;

  const [height, setHeight] = React.useState(visiable ? minHeight : 0); // 弹框的高度
  const contentRef = React.useRef<HTMLDivElement>({} as HTMLDivElement);
  const drawRef = React.useRef<HTMLDivElement>({} as HTMLDivElement);
  const isTouching = React.useRef(false);
  const [startY, setStartY] = React.useState(0);
  const [slideStartHeight, setStartHeightY] = React.useState(0);
  const [scrollStart, setScrollStart] = React.useState(0);
  const touchMovePath = React.useRef([] as number[][]); // 记录手指滑动时最后的动作（只记录Y）
  const isScroll = React.useRef(false); // 是否应该为滚动
  const scrollTimer = React.useRef<number | undefined>();
  const isHeightGoByDown = React.useRef(true); // 记录抽屉高度是否在拖拽过程中低于过最大高度

  React.useEffect(() => {
    if (visiable) {
      setHeightSmoothly(minHeight);
    } else {
      setHeightSmoothly(0);
    }
  }, [visiable]);


  const onTouchStart = (e: React.TouchEvent, move?: boolean) => {
    // 记录起始点位置
    // console.log('开始')
    const { clientY } = e.targetTouches[0];
    setStartY(clientY);
    setStartHeightY(height);
    setScrollStart(0);
    touchMovePath.current = [];

    if (move || height === minHeight) {
      // 若在低位，则一定是move模式
      isTouching.current = true;
      isScroll.current = false;
    } else if (contentRef.current.scrollTop > 0) {
      // 若在高位，且内容有滚动，则一定是滚动模式
      toogleToScroll(clientY);
    } else {
      // 在高位，且scrollTop为0，此时需要额外判断手指初步动作
      isTouching.current = false;
      isScroll.current = false;
    }
  };

  const onTouchMove = (e: React.TouchEvent, move?: boolean) => {
    const { clientY } = e.targetTouches[0];
    // 内容滚动至最顶然后卡片开始下滑，特殊情况
    if (!move && contentRef.current.scrollTop === 0 && !isTouching.current && isScroll.current && height >= maxHeight && touchMovePath.current.length > 2 &&
      touchMovePath.current[2][0] - touchMovePath.current[0][0] > 0) {
      // 切换为拖拽模式
      setStartY(clientY);
      setStartHeightY(height);
      isTouching.current = true;
      isScroll.current = false;
    } else if (move || isTouching.current) {
      // 拖动抽屉
      e.stopPropagation();
      if ((slideStartHeight < maxHeight || isHeightGoByDown.current) &&
        height >= maxHeight) {
        // 切换为滚动模式
        toogleToScroll(clientY);
        isHeightGoByDown.current = false;
      } else {
        // 跟随手指移动
        const newHeight = slideStartHeight + (startY - clientY) / viewHeight * 100;
        setHeight(Math.min(maxHeight, newHeight));
        if (!isHeightGoByDown.current && newHeight < maxHeight) {
          isHeightGoByDown.current = true;
        }
      }

    } else if (isScroll.current) {
      // 内容滚动
      e.stopPropagation();
      contentRef.current.scroll(0, scrollStart + startY - clientY);

    } else if (touchMovePath.current.length >= 2) {

      const path = touchMovePath.current;
      const sub = path[1][0] - path[0][0];
      if (sub <= 0) {
        // 往上滑
        isScroll.current = true;
      } else {
        isTouching.current = true;
      }

    }
    touchMovePath.current.push([clientY, e.timeStamp]);
    if (touchMovePath.current.length > 5) {
      touchMovePath.current.shift();
    }
  }

  const onTouchEnd = (e: React.TouchEvent, move?: boolean) => {
    e.stopPropagation();
    if (move || isTouching.current) {
      isTouching.current = false;
      // console.log('结束');
      if (touchMovePath.current.length < 5) {
        // 回到原位
        setHeightSmoothly(slideStartHeight);
      } else {
        const endY = touchMovePath.current[4][0];
        const sub = endY - touchMovePath.current[0][0];
        if (height < minHeight) {
          // 收起
          setHeightSmoothly(0);
          // 将visiable设置为false
          close();
        } else if (sub === 0) {
          // 回到原位
          setHeightSmoothly(slideStartHeight);
        } else if (sub < 0) {
          // 往上
          setHeightSmoothly(maxHeight);
        } else {
          // 往下
          setHeightSmoothly(minHeight);
        }
      }
    } else if (isScroll.current) {
      isScroll.current = false;
      const path = touchMovePath.current;
      if (path.length > 2) {
        // 进行平滑滚动
        const [Y1, t1] = path[0];
        const [Y2, t2] = path[2];
        let speed = (Y2 - Y1) / (t2 - t1); // 单位： px/ms
        let gap = 0.02;
        if (scrollTimer.current) {
          clearInterval(scrollTimer.current);
          scrollTimer.current = undefined;
        }
        let k = 100; // k越大，滚动加速度越小，能滚更远
        let curTop = contentRef.current.scrollTop;
        scrollTimer.current = setInterval(() => {
          curTop -= speed * 5;
          contentRef.current.scroll(0, curTop);
          if (speed > 0) {
            speed = Math.max(0, speed - gap);
          } else {
            speed = Math.min(0, speed + gap);
          }

          gap = Math.max(Math.abs(speed) / k, 0.004);

          if (Math.abs(speed) === 0) {
            clearInterval(scrollTimer.current);
            scrollTimer.current = undefined;
          }
        }, 5);
      }
    }
  }


  const setHeightSmoothly = (target: number) => {
    const start = height;
    const transition = 240; // ms
    const step = (target - start) / (transition / 10);
    let cnt = 1;
    const timer = setInterval(() => {
      const newHeight = start + cnt * step;
      if (Math.abs(newHeight - target) <= 2) {
        setHeight(target);
        clearInterval(timer);
      } else {
        setHeight(start + cnt * step);
      }
      cnt++;
    }, 10);
  }

  const toogleToScroll = (clientY: number) => {
    // 切换为滚动模式
    setScrollStart(contentRef.current.scrollTop);
    setStartY(clientY);
    isTouching.current = false;
    isScroll.current = true;
    if (scrollTimer.current) {
      // 可能存在上次触摸操作的滚动，需要停止
      clearInterval(scrollTimer.current);
      scrollTimer.current = undefined;
    }
  }

  const close = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHeightSmoothly(0);
    onClose && onClose(); // 父组件回调
  }

  return (
    <div
      className={`vin-draw ${className}`}
      style={{
        ...style,
        top: `${100 - height}%`,
      }}
      ref={drawRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <div className="vin-draw-top-bar"
        onTouchStart={e => onTouchStart(e, true)}
        onTouchEnd={e => onTouchEnd(e, true)}
        onTouchMove={e => onTouchMove(e, true)}
      >
        <div className="touch-line-wrapper">
          <div className="touch-line"></div>
        </div>
        <div className="close-btn" onClick={close}>
          <span className="iconfont icon-close"></span>
        </div>
      </div>
      <div className="slide-content"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  )
}
