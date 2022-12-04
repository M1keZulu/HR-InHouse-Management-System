import { Home, Airplay, Box, FolderPlus, Command, Cloud, FileText, Server, BarChart, Users, Layers, ShoppingBag, List, Mail, MessageCircle, GitPullRequest, Monitor, Heart, Clock, Zap, CheckSquare, Calendar, Image, Film, HelpCircle, Radio, Map, Edit, Sunrise, Package } from 'react-feather'

export const MENUITEMS = [
    {
        menutitle: "Candidate Management",
        menucontent: "Add/Remove and Manage Candidates",
        Items: [
            {
                title: 'Candidates', icon: Home, type: 'sub', badge: "badge badge-success", active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/addCandidate`, type: 'link', title: 'Add Candidate' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/viewCandidates`, type: 'link', title: 'View Candidates' },
                ]
            },
        ]
    },
    {
        menutitle: "Company And Job Management",
        menucontent: "Add/Remove and Manage Companies/Jobs",
        Items: [
            {
                title: 'Companies', icon: Home, type: 'sub', badge: "badge badge-success", active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/addCompany`, type: 'link', title: 'Add Company' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/viewCompanies`, type: 'link', title: 'View Companies' },
                ]
            },
            {
                title: 'Jobs', icon: Home, type: 'sub', badge: "badge badge-success", active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/addJob`, type: 'link', title: 'Add Job' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/viewJobs`, type: 'link', title: 'View Jobs' },
                ]
            },
        ]
    }
]