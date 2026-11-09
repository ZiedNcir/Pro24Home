import AppKit
let base=CommandLine.arguments[1]
let ref=NSImage(contentsOfFile:base+"/docs/design/mes-documents/reference-option-2.png")!
let native=NSImage(contentsOfFile:base+"/artifacts/design/mes-documents/final-light.png")!
let nativeCG=native.cgImage(forProposedRect:nil,context:nil,hints:nil)!
let crop=nativeCG.cropping(to:CGRect(x:57,y:141,width:1170,height:2532))!
let app=NSImage(cgImage:crop,size:NSSize(width:390,height:844))
let canvas=NSImage(size:NSSize(width:800,height:844))
canvas.lockFocus()
NSColor.lightGray.setFill();NSRect(x:0,y:0,width:800,height:844).fill()
ref.draw(in:NSRect(x:0,y:0,width:390,height:844),from:.zero,operation:.copy,fraction:1)
app.draw(in:NSRect(x:410,y:0,width:390,height:844),from:.zero,operation:.copy,fraction:1)
canvas.unlockFocus()
let png=NSBitmapImageRep(data:canvas.tiffRepresentation!)!.representation(using:.png,properties:[:])!
try png.write(to:URL(fileURLWithPath:base+"/artifacts/design/mes-documents/comparison.png"))
let content=NSBitmapImageRep(cgImage:crop).representation(using:.png,properties:[:])!
try content.write(to:URL(fileURLWithPath:base+"/artifacts/design/mes-documents/content.png"))
