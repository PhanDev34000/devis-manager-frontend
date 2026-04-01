import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../store/auth/auth.model';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent implements OnInit {
  private store = inject(Store);

  user$: Observable<User | null>;

  constructor() {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadMe());
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}