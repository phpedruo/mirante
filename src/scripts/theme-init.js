// Marca que o JS está ativo antes da primeira pintura, para evitar que os
// elementos animados apareçam e sumam. Se o script falhar, nada fica escondido.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-anim');
}

// O tema também é decidido aqui, antes de pintar: se fosse depois, quem
// usa o modo escuro veria a página branca por um quadro. A ordem é
// escolha salva > claro. Não seguimos a preferência do sistema: o
// padrão é sempre claro, que é o design aprovado, e o visitante troca
// pelo botão se quiser o escuro. Sem JavaScript o atributo nunca é
// escrito e a página fica no claro. A classe `js` é o que revela o
// botão de troca.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var saved = null;
  try {
    saved = localStorage.getItem('mirante-tema');
  } catch (error) {
    // Armazenamento bloqueado: segue o padrão claro.
  }

  root.dataset.theme = saved === 'dark' ? 'dark' : 'light';
})();
