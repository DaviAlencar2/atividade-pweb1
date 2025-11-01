import { Component } from '@angular/core';
import { TaskBoardComponent } from './components/task-board/task-board.component';

@Component({
  selector: 'app-root',
  imports: [TaskBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Componente principal que agora usa o TaskBoardComponent
}
