import { Home, Airplay, Box, FolderPlus, Command, Cloud, FileText, Server, BarChart, Users, Layers, ShoppingBag, List, Mail, MessageCircle, GitPullRequest, Monitor, Heart, Clock, Zap, CheckSquare, Calendar, Image, Film, HelpCircle, Radio, Map, Edit, Sunrise, Package } from 'react-feather'
export const MENUITEMS = [
    {
        menutitle: "User Management",
        menucontent: "Add/Remove and Manage User Previleges",
        Items: [
            {
                title: 'Dashboard', icon: Home, type: 'sub', badge: "badge badge-success", badgetxt: "2", active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/default`, title: 'Default', type: 'link' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/ecommerce`, title: 'Ecommerce', type: 'link' },
                ]
            },
            {
                title: 'Widgets', icon: Airplay, type: 'sub', active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/widgets/general`, title: 'General', type: 'link' },
                    { path: `${process.env.PUBLIC_URL}/widgets/chart`, title: 'Chart', type: 'link' },
                ]
            },
        ]
    }
]