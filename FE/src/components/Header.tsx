import React from "react";
import {Link} from 'react-router-dom'
import Search from '../components/Search'
const Header: React.FC<{}> = (props) => {

    return (
        <div className="flex justify-between w-full p-4 bg-gray-100">
            <p>Logo</p>
            <Search />
            <Link to='/login' className="p-2 text-white rounded-md bg-violet-800 hover:bg-violet-900">Sign in</Link>
        </div>
    )
}


export default Header