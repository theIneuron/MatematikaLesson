// ============================================================
// TO'G'RI TETRAEDR -- React qobig'i.
//
// Geometriya va sahna `tetra-model.js` da: u komponent EMAS, shuning uchun
// alohida faylda (bitta faylda ham komponent, ham konstanta eksport qilish
// Fast Refresh ni buzadi).
//
// Manba: claude.ai/design loyihasi «3D object modeling», tetrahedron.html.
// Sahifa butunligicha ko'chirilmagan -- sabablari `tetra-model.js` boshida.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react'
import { T, useT, useLang } from './core.jsx'
import { TETRA_LABELS, createScene } from './tetra-model.js'

// `height` ODATDA berilmaydi: balandlikni CSS boshqaradi (`.g11-tetra-host`),
// chunki u ekran o'lchamiga qarab o'zgarishi kerak. Inline qiymat CSS ni
// BOSIB KETADI -- shu sababli u faqat ataylab berilganda qo'yiladi.
export function Tetrahedron({ edge, mode, feats, secT, height, onFace, api: outRef }) {
  const hostRef = useRef(null)
  const apiRef = useRef(null)
  const t = useT()
  const lang = useLang()
  // Kolbek REF da: uni almashtirish sahnani qayta qurmasligi kerak.
  const faceRef = useRef(null)
  useEffect(() => { faceRef.current = onFace })
  const centre = t(TETRA_LABELS.centre)

  useEffect(() => {
    if (!hostRef.current) return undefined
    const api = createScene(hostRef.current, {
      edge,
      centreLabel: centre,
      onFace: (info) => { if (faceRef.current) faceRef.current(info) },
    })
    apiRef.current = api
    if (outRef) outRef.current = api
    return () => {
      api.dispose()
      apiRef.current = null
      if (outRef && outRef.current === api) outRef.current = null
    }
    // Til almashsa sahnadagi yozuv ham almashadi -> qayta quramiz.
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (apiRef.current) apiRef.current.setEdge(edge) }, [edge])
  useEffect(() => { if (apiRef.current) apiRef.current.setMode(mode) }, [mode])
  useEffect(() => { if (apiRef.current) apiRef.current.setSecT(secT) }, [secT])
  useEffect(() => {
    if (!apiRef.current) return
    Object.keys(apiRef.current.featureKeys).forEach((key) => apiRef.current.toggle(key, !!feats[key]))
  }, [feats])

  return (
    <div
      ref={hostRef}
      className="g11-tetra-host"
      style={{
        position: 'relative', width: '100%',
        borderRadius: 10, overflow: 'hidden',
        background: T.paper, border: '1px solid ' + T.line,
        touchAction: 'none',
        ...(height ? { height } : null),
      }}
    />
  )
}

export default Tetrahedron
