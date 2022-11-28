"use strict";

window.addEventListener('DOMContentLoaded', () => {
    // 
    // tabs
    //
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
            // item.style.display = 'none'; // скрити весь контент
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        // tabsContent[i].style.display = 'block';

        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // 
    // timer
    // 
    const deadline = '2022-12-22';

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t <= 0) {
            days = hours = minutes = seconds = 0;
        } else {
              days = Math.floor(t / (1000 * 60 * 60 * 24)),         // мсек в добі
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),        // % - залишок від ділення 
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minuts': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num <= 9) {
            return `0${num}`;
        } else {
            return num;
        } 
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
        
        const timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minuts);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            } 
        }
    }

    setClock('.timer', deadline);

    //
    // Modal Window
    // 
    const modalWindowOpen = document.querySelectorAll('[data-modalOpen]'),
        //   modalWindowClose = document.querySelector('[data-modalClose]'),
          modalWindow = document.querySelector('.modal');

    modalWindowOpen.forEach(btn => btn.addEventListener('click', () => modalAction('open')));

    // modalWindowClose.addEventListener('click', () => modalAction('close'));

    modalWindow.addEventListener('click', (event) => {
        if (event.target === modalWindow || event.target.getAttribute('data-modalClose') == '') {
            modalAction('close');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
            modalAction('close');
        }
    });

    function modalAction (action) {
        if (action === 'close') {
            modalWindow.classList.add('hide');          // додаємо css стиль до тегу модального вікна
            modalWindow.classList.remove('show');
            document.body.style.overflow = '';
        } else if (action === 'open') {
            modalWindow.classList.add('show');          // додаємо css стиль до тегу модального вікна
            modalWindow.classList.remove('hide');
            document.body.style.overflow = 'hidden';    // блокування прокрутки
            clearInterval(modalWindowTimerId);          // 
        } else {
            console.log('Erorr modal window ection!');
        }
    }

    // Time delay to show modal window
    const modalWindowTimerId = setTimeout(() => modalAction('open'), 50000);

    // Scroll pages to same coordinate - end of page
    function modalWindowShowByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        // -1px if not working in browser
            modalAction('open');
            window.removeEventListener('scroll', modalWindowShowByScroll);
        }
    }
    window.addEventListener('scroll', () => modalWindowShowByScroll());

    // 
    // Using classes for cards products
    // 
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.tranfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = +this.price * this.tranfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // const div = new MenuCard();
    // div.render();

    // Fitnes menu
    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,                  // ціна в $
        '.menu .container',  // батьківські елементи
    ).render();             // виклик методу тільки одноразово

    // Premium menu
    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню "Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,                  // ціна в $
        '.menu .container',  // батьківські елементи
    ).render();             // виклик методу тільки одноразово

    // Post menu
    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        16,                  // ціна в $
        '.menu .container',  // батьківські елементи
    ).render();             // виклик методу тільки одноразово

    // 
    // Forms
    //

    const forms = document.querySelectorAll('form');
    const message = {
        loading: "img/form/spinner.svg", //"Загрузка...",
        success: "Дякуємо! Ми зв'яжемось з вами найближчим часом.",
        failure: "Щось пішло не так..."
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // const statusMessage = document.createElement('div');
            // statusMessage.classList.add('status');
            // statusMessage.textContent = message.loading;
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.appendChild(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);
            
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');

            // заголовок формується автоматично!
            // request.setRequestHeader('Content-type', 'multipart/form-data');
            
            // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            // const json = JSON.stringify(object);

            // request.send(json);

            fetch('server.php', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object) //formData
            })
            .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

            // request.send(formData);

/* отриманя даних метоом XMLHttpRequest
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    // statusMessage.textContent = message.success;
                    showThanksModal(message.success);

                    // setTimeout(() => {
                    //     statusMessage.remove();
                    // }, 2000);
                    statusMessage.remove();
                    form.reset();
                    
                } else {
                    // statusMessage.textContent = message.failure;
                    showThanksModal(message.failure);
                }
            });
*/
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        modalAction('open');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-modalClose>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            modalAction('close');
        }, 5000);
    }

    //
    // Fetch API
    //
    fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: "POST",
        body: JSON.stringify({name: 'Alex'}),
        headers: {
            'Content-type': 'application/json'
        } 
    })
        .then(response => response.json())
        .then(json => console.log(json));
});



