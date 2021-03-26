import * as React from 'react'

export default function test() {

  React.useEffect(() => {
    console.log(2333);
  }, []);

  return (
    <div>
      这是一个测试组件
    </div>
  )
}
