# PPT Beautifier

Local tool for turning `docx / pptx / pdf / txt / md` into a redesigned PPTX.

## Start

Double-click either file:

- `tools\ppt_beautifier\start_ppt_beautifier.bat`
- `tools\ppt_beautifier\启动PPT排版美化工具.bat`

Then open:

`http://127.0.0.1:38787`

Keep the terminal window open while using the tool.

## If Double-Click Fails

Check log files here:

`tools\ppt_beautifier\logs`

Common causes:

- Node.js is not available in PATH.
- Port `38787` is already used by another process.
- The file path was moved or deleted.

## Command Line

```powershell
node tools\ppt_beautifier\engine.mjs --input "01_source_materials_原始资料\your-file.docx"
```

With style:

```powershell
node tools\ppt_beautifier\engine.mjs --input "your-file.docx" --style fresh_edu --maxSlides 20
```

## Styles

- `oxstand_bright`: bright blue-white Oxstand style
- `clean_business`: general blue-white business style
- `fresh_edu`: fresh cyan-blue education style

## Output

Generated PPTX files are saved to:

`tools\ppt_beautifier\outputs`

## Notes

- Works best with Word drafts that contain explicit `第1页 / 主标题 / 正文` structure.
- It does not call AI and does not rewrite copy.
- Placeholders such as `XX / XXX` are preserved.
- Scanned PDF files need OCR first; text PDFs are supported.
