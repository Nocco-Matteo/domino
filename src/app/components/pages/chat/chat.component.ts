import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Cards } from 'src/app/configs/chat.config';
import { Messaggio } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  readonly cards = Cards;
  form: FormGroup;
  nome: string | null = null;
  nomeInserito: string | null = null;
  isLandscape!: boolean;
  btnStart: boolean = false;
  chatMessages: Array<Messaggio> = [];
  showCards: boolean = false;


  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      messaggio: ['']
    })
  }

  ngOnInit(): void {
    this.startChat();
  }

  setName(): void {
    this.nomeInserito = this.nome;
    this.chatMessages.push({ text: `Il mio nome è ${this.nome}.`, sender: 'user' });
    this.chatMessages.push({ text: `Benvenuto ${this.nome}, vuoi giocare con me? Seleziona qui sotto il gioco!!`, image: '/assets/imgs/chat/personaggio.png', sender: 'character' });
    this.showCards = true;
  }

  startChat(): void {
    this.chatMessages.push({ text: 'Ciao sono Teddy la volpe! Come ti chiami?', image: '/assets/imgs/chat/personaggio.png', sender: 'character' });
  }


  salutaUtente() {
    this.nome = this.nomeInserito;
  }

  naviga(link: string) {
    switch (link) {
      case 'link1':
        this.router.navigate(['/domino']);
        break;
      case 'link2':
        this.router.navigate(['/memory']);
        break;
      case 'link3':
        this.router.navigate(['/musica']);
        break;
      default:
        break;
    }
  }
}
