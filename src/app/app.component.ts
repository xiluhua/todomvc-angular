import {Component} from '@angular/core';

// const todos = [
//     {id: 1, title: '吃饭', done: true},
//     {id: 2, title: '打球', done: false},
//     {id: 3, title: '写代码', done: true}
// ];

const todos = JSON.parse(window.localStorage.getItem('todos') || '[]');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    public visible = 'completed';
    public todos: {
        id: number,
        title: string,
        done: boolean
    }[] = todos;

    public currentEditing: {
        id: number,
        title: string,
        done: boolean
    } = null;

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.hashchangeHandler();
        // 这里要绑定 bind this,否则 this 是 window 对象
        window.onhashchange = this.hashchangeHandler.bind(this);
    }

    addTodo(e): void {
        console.log(e.target);
        console.log(e.keyCode);
        const titleText = e.target.value;
        if (!titleText.length) {
            return;
        }
        const last = this.todos[this.todos.length - 1];
        const id = last ? last.id + 1 : 1;
        this.todos.push({id: id, title: titleText, done: false});

        // 清除文本框
        e.target.value = '';
        console.log(todos);
    }

    get toggleAll() {
        return this.todos.every(t => t.done);
    }

    set toggleAll(val) {
        this.todos.forEach(t => t.done = val);
    }

    setCurr(todo) {
        this.currentEditing = todo;
    }

    saveEdit(todo, e) {
        todo.title = e.target.value;
        this.currentEditing = null;
    }

    esc(todo: { id: number; title: string; done: boolean }, e) {
        e.target.value = todo.title;
        this.currentEditing = null;
    }

    get remaining() {
        return this.todos.filter(t => !t.done).length;
    }

    clearAllDone() {
        this.todos = this.todos.filter(t => !t.done);
    }

    get filterTodos() {
        if (this.visible === 'all') {
            return this.todos;
        }
        if (this.visible === 'active') {
            return this.todos.filter(t => !t.done);
        }
        if (this.visible === 'completed') {
            return this.todos.filter(t => t.done);
        }
    }

    hashchangeHandler() {
        // 然后动态的将根组件中的 visible 设置为当前的锚点标识
        // 当用户点击锚点的时候，我们需要获取当前的锚点标识，去除 #
        const hash = window.location.hash.substr(1);
        console.log(hash);
        switch (hash) {
            case '/':
                this.visible = 'all';
                break;
            case '/active':
                this.visible = 'active';
                break;
            case '/completed':
                this.visible = 'completed';
                break;
        }
    }

    // 当 Angular 组件数据发生改变的时候，ngDoCheck 钩子函数会被出发
    // tslint:disable-next-line:use-life-cycle-interface
    ngDoCheck() {
        console.log('ngDoCheck()');
        window.localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    remove(i: number) {
        this.todos.splice(i, 1);
    }
}

