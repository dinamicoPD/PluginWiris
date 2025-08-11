
# 📚 Plataforma de Banco de Preguntas Matemáticas

Proyecto profesional en Next.js + React + MathLive para **crear, editar, guardar y resolver bancos de preguntas matemáticas**, con validación algebraica y exacta. Ideal para docentes, Moodle, y autoevaluación.

---

## 🚀 Características principales

- **Multi-banco**: crea, elimina y gestiona varios bancos de preguntas.
- **Tipos de pregunta**: respuesta matemática (cloze) y opción múltiple (multichoice).
- **Editor enriquecido**: enunciados con texto y fórmulas usando teclado MathLive.
- **Validación algebraica y exacta**: corrige respuestas con equivalencia matemática o comparación literal.
- **Evaluación interactiva**: resuelve quizzes, revisa y puntúa tus respuestas.
- **Persistencia local**: todo se guarda en tu navegador (localStorage).
- **Listo para exportar** a Moodle (pronto: GIFT/XML).
- **Tecnologías modernas**: Next.js 15+, React, TypeScript, Tailwind CSS, MathLive, mathjs, KaTeX.

---

## 📦 Instalación

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/dinamicoPD/PluginWiris.git
   cd <carpeta>
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

---

## 🏗️ Estructura del proyecto

```
/src
  /components
    BankSelector.tsx
    QuestionBankEditor.tsx
    QuizFromBank.tsx
    MathLiveEditor.tsx
    LatexText.tsx
  /types
    question.ts
  /app
    page.tsx
    layout.tsx
tailwind.config.js
package.json
README.md
```

---

## 🧩 Componentes principales

- **`page.tsx`**: Página principal. Gestiona bancos, editor y quiz.
- **`QuestionBankEditor.tsx`**: Editor de preguntas, enunciado mixto texto+fórmulas, opciones, validación.
- **`QuizFromBank.tsx`**: Renderiza y evalúa quizzes.
- **`MathLiveEditor.tsx`**: Teclado matemático virtual, captura LaTeX.
- **`LatexText.tsx`**: Renderiza LaTeX con KaTeX.
- **`BankSelector.tsx`**: Selector de bancos.

---

## ✍️ ¿Cómo crear preguntas?

1. **Escribe el enunciado** en el campo de texto.
2. Haz clic en **"➕ Insertar fórmula"** para agregar una fórmula matemática en el lugar del cursor (usa el teclado MathLive).
3. Puedes mezclar texto y fórmulas:  
   Ejemplo:  
   ```
   ¿Cuál es el resultado de \( x^2 + 2x + 1 \) cuando \( x = 3 \)?
   ```
4. Define el tipo de pregunta: **Respuesta directa** o **Multiopción**.
5. Guarda la pregunta. ¡Automáticamente se almacena en el banco activo!

---

## 🛡️ Validación de respuestas

- **Algebraica**: la plataforma usa [mathjs](https://mathjs.org/) para validar respuestas equivalentes aunque tengan distinto orden o formato.
- **Exacta**: la validación exige coincidencia literal de la expresión.
- **Opción múltiple**: puedes marcar más de una respuesta correcta si lo deseas.

---

## 🗄️ Banco de preguntas

- Crea tantos bancos como desees.
- Elige y cambia entre bancos fácilmente.
- Cada banco es **privado** en tu navegador, se guarda en `localStorage`.

---

## 🛒 Exportación a Moodle

- Próximamente: exporta tu banco en formato **GIFT** o **XML** para importar en Moodle o cualquier LMS compatible.

---

## 🔧 Tecnologías usadas

- [Next.js](https://nextjs.org/)  
- [React](https://react.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [MathLive](https://cortexjs.io/docs/mathlive/)  
- [mathjs](https://mathjs.org/)  
- [KaTeX](https://katex.org/)  
- [Tailwind CSS](https://tailwindcss.com/)

---

## ❓ Preguntas frecuentes

- **¿Puedo poner más de una respuesta correcta en opción múltiple?**  
  Sí, puedes marcar varias opciones como correctas.

- **¿Cómo se guarda mi trabajo?**  
  Todo queda en el navegador automáticamente (localStorage).

- **¿Funciona para Moodle?**  
  Sí, puedes copiar fórmulas y pronto exportar en formato GIFT/XML.

- **¿Puedo poner fórmulas y texto juntos?**  
  ¡Sí! El enunciado acepta ambos.

---

## 📚 Referencias y recursos

- [Next.js Docs](https://nextjs.org/docs)
- [MathLive Docs](https://cortexjs.io/docs/mathlive/)
- [mathjs Docs](https://mathjs.org/docs/)
- [KaTeX Docs](https://katex.org/docs/)
- [GIFT Format (Moodle)](https://docs.moodle.org/en/GIFT_format)

---

## 🧑‍💻 Autoría

- Desarrollado por Yesid Vargas (DinamicoPD)

---

## 📝 Licencia

MIT

---
