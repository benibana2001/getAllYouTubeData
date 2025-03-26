import * as React from 'react'

export default function Loader({ isShow }: { isShow: boolean }) {
  return (
    <>
      {isShow && <div className="blocker" data-isshow="true">
        {<div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
      </div>}
    </>
  )
}
