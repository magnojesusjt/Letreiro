import './main.html';
import '../imports/ui/navBar/nav'
import '../imports/startup/routes';
import '../imports/ui/home/home'
import '../imports/ui/footer/footer'
import '../imports/ui/login/login'
import '../imports/ui/menu/menu'
import '../imports/ui/marcarConsulta/marcarConsulta'
import '../imports/ui/perfil/perfil'
import '../imports/ui/addUser/addUser'
import '../imports/ui/agenda/agenda'
import '../imports/ui/gerenciarUsers/gerenciarUsers'
import '../imports/ui/gerenciarChamado/gerenciarChamado'
import '../imports/ui/abrirChamado/abrirChamado'
import '../imports/ui/dashBoards/dashBoards'
import swal from 'sweetalert';
import moment from 'moment';
import 'moment/locale/pt-br'
import chart from '../node_modules/chart.js/dist/chart'



moment.locale('pt-br');


import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);
