import img1 from "../assets/img/abenson.png";
import img2 from "../assets/img/home.png";
import img3 from "../assets/img/wilcon.jpg";

export const companies = [
    { 
        id: 1, name: 'Abenson', val: 'abenson', src: img1, category: [
            {id: 0, text: 'All', val: 'all'},
            {id: 1, text: 'Furniture', val: 'furniture'},
            {id: 2, text: 'Flooring', val: 'flooring',},
            {id: 3, text: 'Lighting', val: 'light'},
            {id: 4, text: 'Kitchen', val: 'kitchen'},
            {id: 5, text: 'Sanitary', val: 'sanitary'},
            
        ] },
        { id: 2, name: 'Home Depot', val: 'home', src: img2 ,category: [
            {id: 0, text: 'All', val: 'all'},
            {id: 1, text: 'Doors', val: 'door'},
            {id: 2, text: 'Windows', val: 'window'},
            {id: 3, text: 'Plumbing', val: 'plumbing'},
            {id: 4, text: 'Flooring', val: 'flooring'},
            {id: 5, text: 'Furniture', val: 'furniture'},
        ]},
        { id: 3, name: 'Wilcon', val: 'wilcon', src: img3, category: [
            {id: 0, text: 'All', val: 'all'},
            {id: 1, text: 'Furniture', val: 'furniture'},
            {id: 2, text: 'Flooring', val: 'flooring'},
            {id: 3, text: 'Construction', val: 'construction'},
            {id: 4, text: 'Walls', val: 'wall'},
            {id: 5, text: 'Windows', val: 'window'},
        ] 
    },
    
];