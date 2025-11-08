import { Todo } from './todo';

export interface TodoGroup {
  id: number;
  name: string;
  todos: Todo[];
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}
