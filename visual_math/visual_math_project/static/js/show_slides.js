let globalSlides = [];
let currentPresentationId = null;
let answerStats = {}; // { slideIndex: { questionIndex: { answers: [] } } } хранение статистики ответов

/**
 * Функция для автоматического парсинга и рендеринга формул KaTeX в тексте.
 * @param {string} text - Текст, содержащий формулы KaTeX.
 * @returns {string} - Текст с отрендеренными формулами.
 */
function renderKatexInText(text) {
    // Регулярное выражение для поиска формул KaTeX
    const katexRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|\\\([^]+\\\)|\\\[[^]+\\\])/g;

    // Разделяем текст на части: обычный текст и формулы
    const parts = text.split(katexRegex);

    // Проходим по всем частям и рендерим формулы
    return parts.map(part => {
        if (katexRegex.test(part)) {
            // Если часть текста - это формула, рендерим её с помощью KaTeX
            try {
                return katex.renderToString(part, {
                    throwOnError: false, // Не выбрасывать ошибку при неудачном рендеринге
                });
            } catch (e) {
                console.error('Ошибка рендеринга формулы:', e);
                return part; // Возвращаем исходный текст, если рендеринг не удался
            }
        } else {
            // Если часть текста - это обычный текст, возвращаем его как есть
            return part;
        }
    }).join(''); // Собираем все части обратно в одну строку
}