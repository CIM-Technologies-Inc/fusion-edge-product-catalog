import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SampleInfo from '../components/SampleInfo'
import MyAccount from '../components/MyAccount'
import Shop from '../components/Shop'
import Product from '../components/Products';
import PerProduct from '../components/PerProduct';
import Login from '../components/Login'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <SampleInfo />,
            },
            {
                path: 'account',
                element: <MyAccount />,
            },
            {
                path: 'shop',
                element: <Shop />,
            },
        ],
    },
    {
        path: 'shop/:brand',
        element: <Product />,
    },
    {
        path: 'shop/:brand/:perproduct',
        element: <PerProduct />,
    },
    {
        path: '/login',
        element: <Login />,
    },
])

export default router;