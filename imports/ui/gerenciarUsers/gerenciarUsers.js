import './gerenciarUsers.html'
import { Meteor } from 'meteor/meteor';
import { Permissoes } from '../../api/permissoes/permissoes';
import swal from 'sweetalert';
import { ReactiveVar } from 'meteor/reactive-var';


const validarCPF =(cpf) => {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

const validarTelefone = (tel) => {
    let expressao =
      "^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$";
    let regex = new RegExp(expressao);
  
    return regex.test(tel);
  };

const validarEmail = (email) => {
    usuario = email.substring(0, email.indexOf("@"));
    dominio = email.substring(
      email.indexOf("@") + 1,
      email.length
    );
    if (
      usuario.length >= 1 &&
      dominio.length >= 3 &&
      usuario.search("@") == -1 &&
      dominio.search("@") == -1 &&
      usuario.search(" ") == -1 &&
      dominio.search(" ") == -1 &&
      dominio.search(".") != -1 &&
      dominio.indexOf(".") >= 1 &&
      dominio.lastIndexOf(".") < dominio.length - 1
    ) {
     return true
    } else {
     return false
    }
  };

Template.gerenciarUsers.helpers({
  users(){
      return Meteor.users.find({}).fetch()
  },
  Permissoes(){
    var permissoes = Permissoes.find({})
    return permissoes
  },
  detalhesUser(){
    const instance = Template.instance();    
    return instance.detalhesUser.get()
  },
  selected: function(){
    const instance = Template.instance();
    var user = instance.detalhesUser.get()
    Session.set("perfilSelecionado",user.profile.perfil)
    return Session.equals('perfilSelecionado', this.perfil) ? 'selected' : '';
  },
  settings: function () {
    return {
        rowsPerPage: 25,
        showNavigation: 'auto',
        showColumnToggles: false,
        showFilter: true,
        fields: [
            { key: 'username', label: 'Login' },
            { key: 'profile.data.name', label: 'Nome' },
            { key: 'emails.0.address', label: 'Email' },
            { key: 'profile.data.telefone', label: 'Telefone' },
            { key: 'profile.data.cpf', label: 'CPF' },
            { key: 'profile.perfil', label: 'perfil' },
            {
                key: 'selecionarUsuario',
                label:'',
                fn: function (value) {
                    // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                    return new Spacebars.SafeString("<button id='btnViewUsuario' data-bs-toggle='modal' data-bs-target='#modalDetalhesUsuario' class='btn btn-primary' title='Detalhes'>Detalhes</button>");
                }
            },
            {
                key: 'delUser',
                label:'',
                fn: function (value) {
                    // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                    return new Spacebars.SafeString("<button type='button' id='btnDesUser' class='btn btn-danger' title='Desativar Usuário'>Desativar</button>");
                }
            }
        ]
    }
}
})

Template.gerenciarUsers.onCreated(function (){
    Meteor.subscribe('users');
    Meteor.subscribe("permissoes");
    i18n.setLanguage('pt-br');

    this.detalhesUser = new ReactiveVar([])

})

Template.gerenciarUsers.events({
    'click #tableUsers tbody tr'(event){
        switch(event.target.id){
            case 'btnViewUsuario':
                const instance = Template.instance();

                var _id = this._id;

                var user = Meteor.users.find({_id}).fetch()

                instance.detalhesUser.set(user[0])
               
               break
            case 'btnDesUser':
                var _id = this._id
                swal({
                    title:"Deseja desativar esse usuário?",
                    icon:"info",
                    buttons: ["Não", "Sim"],
                    dangerMode: true,
                }).then((sim)=>{
                    if(sim){
                        Meteor.call('desativarUsers',_id,function(error){
                            if(!error){
                                swal({
                                    title:"Usuário desativado com sucesso!",
                                    icon: 'success'
                                })
                            }else{
                                swal({
                                    title:"Não foi possível desativar esse usuário",
                                    icon: 'error'
                                })
                            }
                        })
                    }
                })
                break   
        }
    },

    'click #atualizarUsuario'(event){
        event.preventDefault()

        swal({
            title:'Deseja atualizar esse usuário',
            icon:'info',
            buttons: ["Não", "Sim"],
        }).then((sim)=>{
            if(sim){
                let nome = document.getElementById('nomeDetalhes').value
                let cpf = document.getElementById('cpfDetalhes').value
                let email = document.getElementById('emailDetalhes').value
                let perfil = document.getElementById('cargoDetalhes');
                let perfilNome = perfil.options[perfil.selectedIndex].value;
                let telefone = document.getElementById('telefoneDetalhes').value

                if(nome && cpf && email && telefone && perfilNome){
                    if(validarCPF(cpf)){
                        if(validarTelefone(telefone)){
                            if(validarEmail(email)){

                                data = {
                                    profile:{
                                        name:nome,
                                        cpf,
                                        telefone
                                    },
                                    _id:event.target.dataset.id,
                                    email,
                                    perfilNome,
                                }
                                Meteor.call('atualizaUsuario',data,function(error){
                                    if(!error){
                                        swal({
                                            title:'Usuário atualizado com sucesso',
                                            icon:'success'
                                        })

                                        $('#modalDetalhesUsuario').modal('hide')
                                    }else{
                                        console.log(error)
                                        swal({
                                            title:'Não foi possível atualizar o usuário',
                                            icon:'error'
                                        })

                                    }
                                })
                            }else{
                                swal({
                                    title:'E-mail Incorreto!',
                                    text:'Por favor, verifique o seu e-mail!',
                                    icon:'info'
                                })
                            }
                        }else{
                            swal({
                                title:'Telefone Incorreto!',
                                text:'Por favor, verifique o seu telefone!',
                                icon:'info'
                            })
                        }
                    }else{
                        swal({
                            title:"CPF incorreto!",
                            text:"por favor, verifique o seu CPF",
                            icon:"info"
                        })
                    }
                }else{
                    swal({
                        title:"Preencha todos os campos!",
                        // text:"por favor, verifique o seu CPF",
                        icon:"info"
                    })
                }
            }
        })

    },
    
    'click #adicionarUsuario'(event){
        event.preventDefault();

        swal({
            title: "Deseja adcionar esse usuário?",
            icon: "warning",
            buttons: ["Não", "Sim"],
        }).then((willDelete) => {
            if (willDelete) {
                let nome = document.getElementById('nome').value;
                let cpf = document.getElementById('cpf').value;
                let telefone = document.getElementById('telefone').value;
                let email = document.getElementById('email').value;
                let perfil = document.getElementById('cargo');
                let perfilId = perfil.options[perfil.selectedIndex].value;

                if(nome && cpf && email && telefone && perfilId){
                    if(validarCPF(cpf)){
                        if(validarTelefone(telefone)){
                            if(validarEmail(email)){

                                const usuario = {
                                    username: cpf,
                                    email: email,
                                    password: 'agendAki123',
                                    profile:{
                                        data: {
                                            name: nome,
                                            cpf: cpf,
                                            telefone: telefone,
                                        },
                                        perfil: perfilId,
                                        active: true
                                    }
                                }
                                Meteor.call('criarUsuario',usuario,function(error){
                                    if(!error){
                                        swal({
                                            title:'Conta criada com sucesso! Senha padrão é: agendAki123',
                                            icon:'success'
                                        })

                                        $('#modalAdiconarUsuario').modal('hide')
                                    }else{
                                        console.log(error)
                                        swal({
                                            title:'Não foi possível cirar a conta',
                                            icon:'error'
                                        })

                                    }
                                })
                            }else{
                                swal({
                                    title:'E-mail Incorreto!',
                                    text:'Por favor, verifique o seu e-mail!',
                                    icon:'info'
                                })
                            }
                        }else{
                            swal({
                                title:'Telefone Incorreto!',
                                text:'Por favor, verifique o seu telefone!',
                                icon:'info'
                            })
                        }
                    }else{
                        swal({
                            title:"CPF incorreto!",
                            text:"por favor, verifique o seu CPF",
                            icon:"info"
                        })
                    }
                }else{
                    swal({
                        title:"Preencha todos os campos!",
                        // text:"por favor, verifique o seu CPF",
                        icon:"info"
                    })
                }
            } else {
             
            }
          });
    },
})

