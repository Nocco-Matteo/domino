import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  nomeInserito: string = '';
  isLandscape!: boolean;
  btnStart: boolean = false;
  chatMessages: Array<Messaggio> = [];
  showCards: boolean = false;


  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      messaggio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.startChat();
  }

  setName(): void {
    this.nomeInserito = this.form.get('messaggio')?.value;

    if(this.nomeInserito) {
      this.chatMessages.push({ text: `Il mio nome è ${this.nomeInserito}.`, sender: 'user' });
      this.chatMessages.push({
        text: `Benvenuto ${this.nomeInserito}, vuoi giocare con me?  \n Seleziona qui sotto il gioco!!`,
        image: '/assets/imgs/chat/personaggio.png',
        sender: 'character'
      });
      this.showCards = true;
      this.form.get('messaggio')?.setValue('');

    }

  }
  

  startChat(): void {
    this.chatMessages.push({ text: 'Ciao sono Teddy la volpe! Come ti chiami?', image: '/assets/imgs/chat/personaggio.png', sender: 'character' });
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
