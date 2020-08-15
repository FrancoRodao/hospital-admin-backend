const getMenuFrontEnd = (role = 'USER_ROLE') => {
    //USER MENU
    const menu = [
        {
            title: 'main',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Profile', url: '/profile' },
                { title: 'Progress bar', url: '/progress' },
                { title: 'Graficos', url: '/graficas' },
                { title: 'Promesas', url: '/promesas' },
                { title: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            title: 'Maintenance',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Doctors', url: '/doctors' },
                { title: 'Hospitals', url: '/hospitals' }
            ]
        }
    ]
    //ADMIN MENU
    if (role == 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Users', url: '/users' },
        )
    }

    return menu

}

module.exports = getMenuFrontEnd