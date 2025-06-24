# Vue 3 + TypeScript + Vite

Available to visit:
https://halwaaaaa.github.io/vue-hotel-reservation/

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


![image](https://github.com/user-attachments/assets/4b226b71-6b67-4b22-8d3d-9228f3b4d022)
це головний вид поки що. Сайд бар поки що не змінювапв, потім щось придумаю. Далі у таблиці це списки готелів , там є якісь головні стовпчики. На кожній карточці є чекбокси, можна вибирати готелі й видаляти кнопкою, із бази теж воно видаляється.
Якщо на карточці вибрати 3 крапки => view hotel details - то перекине на сторінку де ![image](https://github.com/user-attachments/assets/ec8b366e-f7b8-4523-a405-2e0466b41802)
показується списком основні поля конкретного готелю. Також можна змінити дані у вигляді діалога - я воно поміняється теж у базі. також можна добавити кімнату - на базі воно появиться, але поки ще немає функціоналу це побачити на адмінці й змінювати. буде в некст патчі.
Є слайдер, бо форма велика
![image](https://github.com/user-attachments/assets/f9428bde-a3ae-4c54-85d6-caedc08fa442)
![image](https://github.com/user-attachments/assets/bf7536a6-102e-427b-8e75-40f60d7f52af)
![image](https://github.com/user-attachments/assets/3cc4dbfe-b7d1-4a33-8ad9-0cc192a42f7c)
Тут поки я ще не вирішив питання із фото, що фото готеля, що й кімнати, просто є поля на сторінці під це. Це форма для добавлення кімнати, ну воно , мабуть, буде все ще мінятись. 
![image](https://github.com/user-attachments/assets/4bcc9bf3-0d19-4775-a2ee-40b6ea35d26b)
Форма під готель. Трохи набрехав про фото. Його можна добавити, і навіть в базі можна знайти його потім. Просто не думаю, що це правильне рішення для бази в теорії. Знайшов баг під час написання, що добавляє в таблицю не по останньому доданому, а по чомусь іншому. ну це не баг мабуть, але просто, як на мене, так не має бути

![image](https://github.com/user-attachments/assets/ceebe8e4-bf29-4da6-93f6-98d61421540d)
Є всякі різні тости від бібліотеки

![image](https://github.com/user-attachments/assets/441d7c51-4dd9-4825-9307-99f39f205e7d)
І от так кінцево виглядає свіжо доданий готель із фото
Самі компоненти хаотично покидані, й є коментарі
Фото з бази
![image](https://github.com/user-attachments/assets/40662649-3667-4fa8-b707-6e42716e7695)
