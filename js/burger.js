document.getElementsByClassName('burger')[0].addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementsByClassName('header__top')[0].classList.toggle('header__top--burger-open');
});