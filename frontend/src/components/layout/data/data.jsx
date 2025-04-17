import { ShoppingBag , 
  LayoutDashboard, 
  ShoppingCart,
  GalleryVerticalEnd,
  UsersRound , 
  User, 
  BookMarked , 
  Star , 
  PanelsTopLeft , 
  UserCog, 
  Wrench, 
  Cog ,
  ShieldEllipsis,
  Palette , 
  CircleUser, 
  CircleHelp,
  Bell
} from "lucide-react";
export const data = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams : {
    name: 'eCommerce',
    logo: ShoppingBag,
    plan: 'Vite + ShadcnUI',
  },
  navMain : [
    {
      url: "#",
      icon: LayoutDashboard,
      title : 'Dashboard'
    },
    {
      title : 'Produits',
      isActive: false,
      icon : ShoppingCart ,
      url: "#",
      items : [
        {
          title : 'Liste des produits',
          url : '/products'
        }, 
        {
          title : 'Ajouter un produit',
          url : '/addproducts'
        }, 
        {
          title : 'Catégories',
          url : 'categories'
        }
      ]
    }, 
    {
      title : 'Commandes',
      isActive: false,
      icon : GalleryVerticalEnd  ,
      url: "#",
      items : [
        {
          title : 'Liste des commandes',
          url : '/orders'
        }, 
        {
          title : 'Details de la commande',
          url : '/detailsorders'
        }
      ]
    }, 
    {
      title : 'Clients',
      isActive: false,
      icon : UsersRound,
      url: "#",
      items : [
        {
          title : 'Liste des clients',
          url : '/clients'
        },
        {
          title : 'Details Clients' , 
          url : '/detailclients'
        }
      ]
    }, 
    {
      title : 'Gérer les avis',
      url : '/reviews',
      icon : Star
    }, 
    {
      title : 'Références',
      url : '/reference',
      icon : BookMarked
    }
  ],
  navUsers : [
    {
      title : 'Utilisateurs',
      isActive: false,
      icon : User  ,
      url: "#",
      items : [
        {
          title : 'Listes',
          url : '/listes'
        }, 
        {
          title : 'View',
          url : '/views'
        }
      ]
    }, 
    {
      title : 'Authorisation',
      isActive: false,
      icon : GalleryVerticalEnd  ,
      url: "#",
      items : [
        {
          title : 'Roles',
          url : '/roles'
        }, 
        {
          title : 'Permissions',
          url : '/permissions' ,
        }
      ]
    }, 
  ] , 
  navBanner : [
    {
      title : 'Bannière',
      isActive: false,
      icon : PanelsTopLeft  ,
      url: "#",
      items : [
        {
          title : 'Liste des bannières',
          url : '/banners'
        },
        {
          title : 'Ajouter une bannière',
          url : '/addbanners'
        }
      ]
    }, 
  ],
  navSetting  : [
    {
      title : 'Paramètre',
      isActive: false,
      icon : Cog  ,
      url: "#",
      items : [
        {
          title : 'Details Magasin', 
          url : '/store',
        },
        {
          title : 'Paiement',
          url : '/payment',
        },
        {
          title : 'Verifier',
          url : '/verify',
        },
        {
          title : 'Livraison',
          url : '/delivery',
        } , 
        {
          title : 'Emplacement', 
          url : '/location'
        }, 
        {
          title : 'Notifications',
          url : '/notifications'
        }
      ]
    }, 
    {
      title : 'Mon Compte',
      isActive: false,
      icon : CircleUser  ,
      url: "#",
      items : [
        {
          title : 'Profile',
          url : '/profile' , 
          icon : UserCog
        },
        {
          title : 'Account',
          url : '/account',
          icon : Wrench
        },
        {
          title : 'Sécurité',
          url : '/security' , 
          icon : ShieldEllipsis
        },
        {
          title : 'Apparance',
          url : '/apparence', 
          icon : Palette
        },
        {
          title : 'Notifications',
          url : '/notifications' , 
          icon : Bell
        } 
      ]
    }, 
    {
      title: 'Help Center',
      url: '/help-center',
      icon: CircleHelp,
    }
    
  ]
};
