import { Home, Airplay, Box, FolderPlus, Command, Cloud, FileText, Server, BarChart, Users, Layers, ShoppingBag, List, Mail, MessageCircle, GitPullRequest, Monitor, Heart, Clock, Zap, CheckSquare, Calendar, Image, Film, HelpCircle, Radio, Map, Edit, Sunrise, Package } from 'react-feather'
export const MENUITEMS = [
    {
        menutitle: "User Management",
        menucontent: "Add/Remove and Manage User Previleges",
        Items: [
            {
                title: 'Users', icon: Home, type: 'sub', badge: "badge badge-success", active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/addUser`, type: 'link', title: 'Add User' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/viewUsers`, type: 'link', title: 'View Users' },
                ]
            },
        ]
    }
]