(function () {
    "use strict";
    const URL_API = 'http://localhost:3000/api';
    const SEARCH_DELAY = 300;
    const clientListElement = document.querySelector('.client-list');
    const popupContainerElement = document.querySelector('.popup-wrapper');
    const popupElement = document.querySelector('.popup-form');
    const confirmElement = document.querySelector('.popup-confirm__wrapper');
    const btnAddContactElement = document.querySelector('.form-client__add-contact');
    const textErrorPopupElement = document.querySelector('.popup-form__text-error');
    const sleep = async ms => await new Promise(resolve => setTimeout(resolve, ms));

    
    const TEMPLATES = {
        svgIcon: {
            contact: `<svg class="contact__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="contact__icon_opacity" opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
            </svg>`,
            fb: `<svg class="contact__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="contact__icon_opacity" opacity="0.7">
            <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
            </g>
            </svg>`,
            email: `<svg class="contact__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="contact__icon_opacity" opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
            </svg>`,
            phone: `<svg class="contact__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="contact__icon_opacity" opacity="0.7">
            <circle cx="8" cy="8" r="8" fill="#9873FF"/>
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
            </g>
            </svg>`,
            vk: `<svg class="contact__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="contact__icon_opacity" opacity="0.7">
            <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
            </g>
            </svg>`,
            btnEdit: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7" clip-path="url(#clip0_216_219)">
            <path d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z" fill="#9873FF"/>
            </g>
            <defs>
            <clipPath >
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`,
            btnCancel: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g  opacity="0.7" clip-path="url(#clip0_216_224)">
            <path  d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
            </g>
            <defs>
            <clipPath >
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`,
            btnDelContact: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g  clip-path="url(#clip0_121_1083)">
            <path  d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
            </g>
            <defs>
            <clipPath >
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`,
            btnAddContact: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_121_1281)">
            <path  d="M8.00001 4.66671C7.63334 4.66671 7.33334 4.96671 7.33334 5.33337V7.33337H5.33334C4.96668 7.33337 4.66668 7.63337 4.66668 8.00004C4.66668 8.36671 4.96668 8.66671 5.33334 8.66671H7.33334V10.6667C7.33334 11.0334 7.63334 11.3334 8.00001 11.3334C8.36668 11.3334 8.66668 11.0334 8.66668 10.6667V8.66671H10.6667C11.0333 8.66671 11.3333 8.36671 11.3333 8.00004C11.3333 7.63337 11.0333 7.33337 10.6667 7.33337H8.66668V5.33337C8.66668 4.96671 8.36668 4.66671 8.00001 4.66671ZM8.00001 1.33337C4.32001 1.33337 1.33334 4.32004 1.33334 8.00004C1.33334 11.68 4.32001 14.6667 8.00001 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00004C14.6667 4.32004 11.68 1.33337 8.00001 1.33337ZM8.00001 13.3334C5.06001 13.3334 2.66668 10.94 2.66668 8.00004C2.66668 5.06004 5.06001 2.66671 8.00001 2.66671C10.94 2.66671 13.3333 5.06004 13.3333 8.00004C13.3333 10.94 10.94 13.3334 8.00001 13.3334Z" fill="#9873FF"/>
            </g>
            <defs>
            <clipPath>
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`,
            btnAddContactHover: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_124_14)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33331 8.00016C1.33331 4.32016 4.31998 1.3335 7.99998 1.3335C11.68 1.3335 14.6666 4.32016 14.6666 8.00016C14.6666 11.6802 11.68 14.6668 7.99998 14.6668C4.31998 14.6668 1.33331 11.6802 1.33331 8.00016ZM7.33329 5.33366C7.33329 4.96699 7.63329 4.66699 7.99996 4.66699C8.36663 4.66699 8.66663 4.96699 8.66663 5.33366V7.33366H10.6666C11.0333 7.33366 11.3333 7.63366 11.3333 8.00033C11.3333 8.36699 11.0333 8.66699 10.6666 8.66699H8.66663V10.667C8.66663 11.0337 8.36663 11.3337 7.99996 11.3337C7.63329 11.3337 7.33329 11.0337 7.33329 10.667V8.66699H5.33329C4.96663 8.66699 4.66663 8.36699 4.66663 8.00033C4.66663 7.63366 4.96663 7.33366 5.33329 7.33366H7.33329V5.33366Z" fill="#9873FF"/>
            </g>
            <defs>
            <clipPath >
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
            </svg>`
        },
        tableRowContact: function (objDataContact) {
            const { id, name, surname, lastName, contacts, updatedAt, createdAt } = objDataContact;
            let row = myCreateElement('tr', [['class', 'client row']])

            function createTdWithText(data, classEl='') {
                let td = document.createElement('td');
                td.setAttribute('class', `column ${classEl}`);
                td.textContent = data;
                row.append(td);
            }
            function createTdWithElement(element) {
                let td = document.createElement('td');
                td.classList.add('column');
                td.append(element);
                row.append(td);
            }
            function formatDate(date) {
                let dd = date.getDate();
                if (dd < 10) dd = '0' + dd;

                let mm = date.getMonth() + 1;
                if (mm < 10) mm = '0' + mm;

                let yy = date.getFullYear();

                let hh = date.getHours();
                if (hh < 10) hh = '0' + hh;

                let mimi = date.getMinutes();
                if (mimi < 10) mimi = '0' + mimi;

                let time = document.createElement('p');
                time.innerHTML = `${dd}.${mm}.${yy}<span class="client__hour">${hh}:${mimi}</span>`;

                return time;

            }

            createTdWithText(id, 'client__id');
            createTdWithText(surname + ' ' + name + ' ' + lastName);
            createTdWithElement(formatDate(new Date(createdAt)));
            createTdWithElement(formatDate(new Date(updatedAt)));
            createTdWithElement(TEMPLATES.ListlinkIconContact(contacts));

            let btnChange = document.createElement('button');
            btnChange.innerHTML = `${TEMPLATES.svgIcon.btnEdit} Изменить`;
            btnChange.classList.add('client__change');
            btnChange.addEventListener('click', async function() {
                LoadSpenner.mount(this, '#9873FF', 'Изменить');
                let client = await Client.getClient(id);
                showPopupUpdateClient(client);
            });

            let btnDel = document.createElement('button');
            btnDel.innerHTML = `${TEMPLATES.svgIcon.btnCancel} Удалить`;
            btnDel.classList.add('client__delete');
            btnDel.addEventListener('click', async function() {
                LoadSpenner.mount(this, '#F06A4D', 'Удалить');
                confirmElement.style.display = 'flex';
                document.querySelector('.popup-confirm__delete').value = id;
            });

            let btnsActions = myCreateElement('div', [['class', 'client__action']]);
            btnsActions.append(btnChange, btnDel);
            createTdWithElement(btnsActions);

            return row;
        },
        ListlinkIconContact: function (listContacts) {
            let ul = myCreateElement('ul', [['class', 'contacts']]);

            listContacts.forEach((contact, index, contacts) => {
                let li = document.createElement('li');
                li.classList.add('contact');
                let span = myCreateElement(
                    'span', 
                    [['class', 'contact__info'], ['style', 'display: none']]
                );
                let link = myCreateElement('a', [
                    ['class', 'contact__link'],
                    ['href', contact.value],
                    ['target', '_blank']
                ]);
                let spanValue = myCreateElement('span', [['class', 'contact__info-value']], contact.value);

                if (contact.type === 'Телефон') {
                    link.innerHTML = TEMPLATES.svgIcon.phone;
                    link.setAttribute('href', `tel:${contact.value}`);
                } else if (contact.type === 'Email') {
                    link.innerHTML = TEMPLATES.svgIcon.email;
                    link.setAttribute('href', `mailto:${contact.value}`);
                } else if (contact.type === 'Facebook') link.innerHTML = TEMPLATES.svgIcon.fb;
                else if (contact.type === 'VK') link.innerHTML = TEMPLATES.svgIcon.vk;
                else {
                    link.innerHTML = TEMPLATES.svgIcon.contact;
                    span.append(myCreateElement(
                        'span',
                        [['class', 'contact__info-type']],
                        contact.type + ':'
                    ));
                }

                span.append(spanValue);
                li.append(span, link);

                li.addEventListener('mouseover', () => span.style.display = 'flex');
                li.addEventListener('mouseout', () => span.style.display = 'none');

                if (index === 4) {
                    li.classList.add('hidden');
                    let showButton = myCreateElement('span', [['class', 'contact__btn-show']], `+${contacts.length - 4}`);
                    showButton.addEventListener('click', function(ev) {
                        ev.preventDefault();

                        this.parentElement.style.alignContent = "space-between";

                        for (const li of this.parentElement.children) {
                            li.classList.remove('hidden');
                        }

                        this.remove();
                    });
                    ul.append(li, showButton);
                } else if (index > 4) {
                    li.classList.add('hidden');
                    ul.append(li);
                } else {
                    ul.append(li);
                }
            });

            return ul;
        },
        createInputContact: function (type='', value='') {
            let container = myCreateElement('div', [['class', 'form-client__contact']]);
            let contactsNames = ['Телефон', 'Email', 'VK', 'Facebook', 'Другое'];

            let select = myCreateElement('select', [
                ['class', 'form-client__contact-type'],
                ['name', 'type'],
                ['form', 'form']
            ]);
            for (const t of contactsNames) {
                let option = myCreateElement('option', [['value', t]], t);
                select.append(option);
            }
            if (contactsNames.indexOf(type) == -1) select.append(myCreateElement('option', [['value', type]], type));

            let dropDown = myCreateElement('div', [['class', 'contact__drop-down']]);
            let dropDownHead = myCreateElement('div', [['class', 'contact__drop-down-head']], 'Телефон');
            let dropDownItems = myCreateElement('ul', [['class', 'contact__drop-down-items']]);

            for (const t of contactsNames) {
                let dropDownItem = myCreateElement('li', [['class', 'contact__drop-down-item']], t);

                dropDownItem.addEventListener('click', function(ev) {
                    ev.preventDefault();

                    if (this.textContent == 'Другое') {
                        let another_item = myCreateElement('input', [['type', 'text'], ['class', 'contact__drop-down-another-item']]);
                        select.children[4].setAttribute('selected', 'selected');
                        another_item.addEventListener('click', ev => ev.stopPropagation());
                        another_item.addEventListener('input', function(ev) {
                            ev.preventDefault();
                            select.children[4].value = this.value;
                        });
                        dropDownHead.textContent = '';
                        dropDownHead.append(another_item);
                    } else {
                        dropDownHead.textContent = this.textContent;
                        for (const el of select.children) {
                            if (el.textContent == this.textContent) el.setAttribute('selected', 'selected');
                        }
                    }

                })
                dropDownItems.append(dropDownItem);
            }

            dropDown.addEventListener('click', function(ev) {
                this.classList.toggle('opened-select');
            });
            dropDown.append(dropDownHead, dropDownItems);

            let input = myCreateElement('input', [
                ['class', 'form-client__contact-value'],
                ['type', "text"],
                ['name', 'value'],
                ['form', 'form'],
                ['placeholder', 'Введите данные контакта']
            ]);

            if (type !== '' && value !== '') {
                dropDownHead.textContent = type;
                select.value = type;
                input.value = value;
            }

            let button = myCreateElement('button', [['class', 'form-client__contact-delete']]);
            button.innerHTML = TEMPLATES.svgIcon.btnDelContact;

            button.addEventListener('click', function (ev) {
                ev.preventDefault();

                btnAddContactElement.style.display = 'flex';
                this.parentElement.remove();
            });

            container.append(select, dropDown, input, button);
            return container;
            // <div class="form-client__contact">
            //     <select class="form-client__contact-type" name="type" form="form">
            //         <option value="Телефон" selected>Телефон</option>
            //         <option value="Телефон">Доп. Телефон</option>
            //         <option value="Email">Email</option>
            //         <option value="VK">Vk</option>
            //         <option value="Facebook">Facebook</option>
            //     </select>
            //     <input class="form-client__contact-value" type="text" name="value">
            //     <button class="form-client__contact-delete">x</button>
            // </div>
        }
    }

    class Client {
        static listClient;

        static async updateListClient(queryParam='') {
            await sleep(1000);
            // Запрашиваем контакты и ждем данные от сервера
            let response = await fetch(URL_API + '/clients' + queryParam);
    
            if (response.ok) {
                this.listClient = await response.json();
                console.log('Обновился список контактов!', this.listClient);
                this.filterListClients('id', true);
            } else {
                console.log('Неудачный запрос: ', response.status, response.statusText);
                this.listClient = [];
            }
        }

        static async getClient(id) {
            await sleep(1000);
            let response = await fetch(URL_API + '/clients/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
    
            if (response.ok) {
                return await response.json();
            }
            else {
                console.log('Неудачный запрос: ', response.status, response.statusText, response.errors);
                return response.json();
            }
        }

        static async saveClient(client) {
            let response = await fetch(URL_API + '/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(client)
            });
    
            if (response.ok) {
                await this.updateListClient();
                return response;
            }
            else {
                console.log('Неудачный запрос: ', response.status, response.statusText, response.errors);
                return response.json();
            }
        }

        static async updateClient(id, client) {
            let response = await fetch(URL_API + '/clients/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(client)
            });
    
            if (response.ok) {
                await this.updateListClient();
                return response;
            }
            else {
                console.log('Неудачный запрос: ', response.status, response.statusText, response.errors);
                return response.json();
            }
        }

        static async delClient(id) {
            let response = await fetch(URL_API + '/clients/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
    
            if (response.ok) await this.updateListClient();
            else console.log('Неудачный запрос: ', response.status, response.statusText);
        }

        static filterListClients(by, method=false) {
            console.log('Фильтрую новый список....', this.listClient);
            if (method) {
                if (by === 'id') this.listClient = this.listClient.sort((a, b) => a[by] - b[by]);
                else if (by === 'surname') this.listClient = this.listClient.sort((a, b) => a[by] < b[by] ? 1 : -1);
                else this.listClient = this.listClient.sort((a, b) => new Date(a[by]).getTime() - new Date(b[by]).getTime());
            } else {
                if (by === 'id') this.listClient = this.listClient.sort((a, b) => b[by] - a[by]);
                else if (by === 'surname') this.listClient = this.listClient.sort((a, b) => a[by] > b[by] ? 1 : -1);
                else this.listClient = this.listClient.sort((a, b) => new Date(b[by]).getTime() - new Date(a[by]).getTime());
            }
        }
    }

    class LoadSpenner {
        static loadElement;
        static oldInnerLoadElement;
        
        static get(color) {
            return `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C17.6755 2 15.454 2.4405 13.414 3.243" stroke="${color}" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/></svg>`;
        }

        static mount(button, color, text) {
            this.loadElement = button;
            this.oldInnerLoadElement = button.innerHTML;
            this.loadElement.classList.add('load');
            this.loadElement.innerHTML = `${this.get(color)} ${text}`;
        }

        static unmount() {
            if (this.loadElement !== null) {
                this.loadElement.innerHTML = this.oldInnerLoadElement;
                this.loadElement.classList.remove('load');
                this.loadElement = null;
            }
        }
    }

    function myCreateElement(selector, listAttributes, text='') {
        let el = document.createElement(selector);
        listAttributes.forEach(attr => el.setAttribute(attr[0], attr[1]));
        if (text !== '') el.textContent = text;
        return el;
    }

    function changeTableInfo(text_info) {
        let info = document.querySelector('.clients__info');
        info.textContent = text_info;
    }

    function showListClient(clients, err = false) {
        console.log('Отображаю список контактов на странице:', Client.listClient);
        clientListElement.innerHTML = '';
        changeTableInfo('');

        if (err) {
            clientListElement.append(TEMPLATES.tableRowInfo('Что-то пошло не так!'));
        } else {
            if (clients.length !== 0) {
                clients.forEach(client => {
                    clientListElement.append(TEMPLATES.tableRowContact(client));
                });
            } else {
                changeTableInfo('Контактов нет!');
            }
        }
    }

    function showPopupUpdateClient(client) {

        LoadSpenner.unmount();

        let linkDelClientElement = myCreateElement('a', [
            ['class', 'popup-form__del-client link-button'],
            ['href', '#']
        ], 'Удалить клиента');
        linkDelClientElement.addEventListener('click', (ev) => {
            ev.preventDefault();
            console.log('Подтвердите');
            popupContainerElement.style.display = 'none';
            confirmElement.style.display = 'flex';
            document.querySelector('.popup-confirm__delete').value = client.id;
        });

        popupElement.children[0].children[0].innerHTML = `Изменить данные <span class="form-name__id">ID: ${client.id}</span>`;
        popupElement.children[0].children.form.surname.value = client.surname;
        popupElement.children[0].children.form.name.value = client.name;
        popupElement.children[0].children.form['last-name'].value = client.lastName !== '' ? client.lastName : '';

        client.contacts.forEach(contact => {
            btnAddContactElement.before(TEMPLATES.createInputContact(contact.type, contact.value));
        });

        if (client.contacts.length > 9) btnAddContactElement.style.display = 'none';
        else btnAddContactElement.style.display = 'flex';


        popupElement.children[0].children.form.submit.value = client.id;

        popupElement.append(linkDelClientElement);

        popupContainerElement.style.display = 'flex';
    }

    function handlerClickBtnSort(ev) {
        ev.preventDefault();
        let orderBy = this.getAttribute('alt');
        document.querySelector('.sort-active').classList.remove('sort-active');
        this.parentElement.classList.add('sort-active');

        if (this.classList.contains('active')) Client.filterListClients(orderBy, false);
        else Client.filterListClients(orderBy, true);

        this.classList.toggle('active');
        showListClient(Client.listClient);
    }

    function CloseAndClearPopupForm() {
        LoadSpenner.unmount();
        popupContainerElement.style.display = 'none';
        document.forms.client.reset();
        document.querySelectorAll('.form-client__contact').forEach(e => e.remove());
        let btnDel = document.querySelector('.popup-form__del-client');
        if (btnDel) btnDel.remove();
        popupElement.children[0].children.form.submit.value = '';
        textErrorPopupElement.innerHTML = '';
    }

    document.addEventListener('DOMContentLoaded', async function () {
        
        LoadSpenner.mount(document.querySelector('.clients__load'), '#9873FF', '');

        // Сохраняем список контактов из БД в статичное свойство класса
        await Client.updateListClient();

        const listBtnSortElement = document.querySelectorAll('.btn-sort');
        const searchInputElement = document.querySelector('.search-clients');
        const btnAddClientElement = document.querySelector('.btn-add-client');
        const btnClosePopupElement = document.querySelector('.popup-form__btn-close');
        const confirmDelElement = document.querySelector('.popup-confirm__delete');
        const confirmCencelElement = document.querySelector('.popup-confirm__cancel');
        const btnCloseConfirmElement = document.querySelector('.popup-confirm__btn-close');
        
        LoadSpenner.unmount();
        showListClient(Client.listClient);

        // Добавляем возможность сортировать список контактов
        // по нажатию на иконки 
        listBtnSortElement.forEach(btn => {
            btn.addEventListener('click', handlerClickBtnSort);
        });

        // Обрабатываем ввод в поле input для поиска контакта
        let inputTimeout;
        searchInputElement.addEventListener('input', function (ev) {
            ev.preventDefault();
            clearTimeout(inputTimeout);

            // Даем 0,3 секунды на ввод поисковой строки
            // затем осуществляем запрос в бд для поиска контактов
            // после чего отображаем найденые контакты на странице
            inputTimeout = setTimeout(() => {
                clientListElement.classList.add('.load');

                Client.updateListClient(`?search=${this.value}`)
                .then(() => {
                    clientListElement.classList.remove('.load');
                    showListClient(Client.listClient);
                });
            }, SEARCH_DELAY);
        });

        // Добавить клиента - показываем форму
        btnAddClientElement.addEventListener('click', (ev) => {
            btnAddContactElement.style.display = 'flex';
            popupContainerElement.style.display = 'flex';
            popupElement.children[0].children[0].textContent = 'Новый клиент';
        });

        // Закрыть и отчистить ворму 
        btnClosePopupElement.addEventListener('click', CloseAndClearPopupForm);
        popupContainerElement.addEventListener('click', (ev) => {
            if (ev.target.classList.contains('popup-wrapper')) CloseAndClearPopupForm();
        });
        btnCloseConfirmElement.addEventListener('click', function(ev) {
            LoadSpenner.unmount();
            confirmElement.style.display = 'none';
            CloseAndClearPopupForm();
        });
        confirmElement.addEventListener('click', function(ev) {
            if (ev.target.classList.contains('popup-confirm__wrapper')) {
                LoadSpenner.unmount();
                this.style.display = 'none';
                CloseAndClearPopupForm();
            }
        });

        // Даем возможность добавить контакт на клиенте в форме 
        btnAddContactElement.addEventListener('click', function(ev) {
            ev.preventDefault();
            document.querySelector('.form-client__contacts').style.padding = '25px 0';

            if (document.querySelectorAll('.form-client__contact').length < 9) {
                this.before(TEMPLATES.createInputContact());
            } else {
                this.before(TEMPLATES.createInputContact());
                this.style.display = 'none';
            }
        });
        btnAddContactElement.addEventListener('mouseover', function(ev) {
            this.innerHTML = TEMPLATES.svgIcon.btnAddContactHover + ' Добавить контакт';
        });
        btnAddContactElement.addEventListener('mouseout', function(ev) {
            this.innerHTML = TEMPLATES.svgIcon.btnAddContact + ' Добавить контакт';
        });

        // SUBMIT - обработка и отправка формы
        document.forms.client.addEventListener('submit', function(ev) {
            ev.preventDefault();

            LoadSpenner.mount(this.submit, '#B89EFF', 'Сохранить');

            let surname = this.elements.surname.value;
            let name = this.elements.name.value;
            let lastName = this.elements['last-name'].value;
            let id = this.elements.submit.value;

            let contacts = [];

            if (typeof this.elements.value !== 'undefined' && this.elements.value.hasOwnProperty('0')) {
                for (let i = 0; i < this.elements.value.length; i++) {
                    contacts.push({
                        type: this.elements.type[i].value,
                        value: this.elements.value[i].value
                    });
                }
            } else if (typeof this.elements.value !== 'undefined') {
                contacts.push({
                    type: this.elements.type.value,
                    value: this.elements.value.value
                });
            }

            if (id !== '') {
                Client.updateClient(id, { surname, name, lastName, contacts })
                .then((result) => {
                    LoadSpenner.unmount();
                    if (result.hasOwnProperty('errors')) {
                        let textErr = '';
                        for (const err of result.errors) {
                            textErr += `Ошибка: ${err.message}<br>`;
                        }
                        textErrorPopupElement.innerHTML = textErr;
                    } else {
                        CloseAndClearPopupForm();
                        showListClient(Client.listClient);
                    }
                });
            } else {
                Client.saveClient({ surname, name, lastName, contacts })
                .then((result) => {
                    LoadSpenner.unmount();
                    if (result.hasOwnProperty('errors')) {
                        let textErr = '';
                        for (const err of result.errors) {
                            textErr += `Ошибка: ${err.message}<br>`;
                        }
                        textErrorPopupElement.innerHTML = textErr;
                    } else {
                        CloseAndClearPopupForm();
                        showListClient(Client.listClient);
                    }
                });
            }
        });

        // Кнопка подтверждения удаления клиента
        confirmDelElement.addEventListener('click', async function(ev) {
            ev.preventDefault();

            LoadSpenner.unmount();

            LoadSpenner.mount(this, '#B89EFF', 'Удалить');

            await Client.delClient(this.value);

            LoadSpenner.unmount();

            showListClient(Client.listClient);
            CloseAndClearPopupForm();
            confirmElement.style.display = 'none';
        });

        // Отмена удаления клиента
        confirmCencelElement.addEventListener('click', ev => {
            ev.preventDefault();

            LoadSpenner.unmount();

            confirmElement.style.display = 'none';
        });
    });
})();