import { useState } from 'react';
import { Button } from './components/Button';
import { Input } from './components/input';

type Todo = {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
};
// Todo型エイリアスの定義　value：Todoの内容を格納　id：各Todo一意の識別子
// checked：Todoがチェック済みかどうか　removed：Todoが削除されたかどうか

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  // useStateの中に型指定することで型が異なる値をステートに代入されることを防ぐ
  // todos配列にはTodoオブジェクト型の配列以外の値を代入不可

  const handleSubmit = () => {
    if (text.trim() === '') {
      alert('タスクを入力してください');
    } else {
      const newTodo: Todo = {
        value: text,
        id: new Date().getTime(),
        checked: false,
        removed: false,
      };
      // new Dateで日付と時刻を表しgetTimeでm秒単位で取得し異なるIDを取得
      setTodos((todos) => [...todos, newTodo]);
      setText('');
      // Todoリストの内容Todosを展開し新たに取得したnewTodoを末尾に追加
      // その後フォームのテキスト入力を空にリセット
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  // React.ChangeEvent<HTMLInputElement>はReactコンポーネント内で
  // フォーム要素の値が変更されたときに、その変更イベントに関連する型情報を提供する
  // テキストが入力される毎に入力内容(value)をsetTextを使ってtext状態変数に反映させる

  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };

  //     const newTodo = todos.find((todo) => todo.id === id);
  //     if (!newTodo) return todos;
  //     return [...todos, newTodo];
  //   });
  // };

  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };
  // removedプロパティがfalseのtodoのみで新たにtodosのリストを作成

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V,
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };

  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => handleSort(e.target.value as Filter)}
      >
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱</option>
      </select>
      {filter === 'removed' ? (
        <Button
          title="ゴミ箱を空にする"
          propsOnClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        />
      ) : (
        filter !== 'checked' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              type="text"
              propsOnchange={(e) => handleChange(e)}
              value={text}
            />
            <Button title="追加" propsOnClick={() => handleSubmit} />
          </form>
        )
      )}
      <ol>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <Input
                type="text"
                propsOnchange={(e) =>
                  handleTodo(todo.id, 'value', e.target.value)
                }
                value={todo.value}
                disabled={todo.checked || todo.removed}
              />
              <Input
                type="checkbox"
                propsOnchange={() =>
                  handleTodo(todo.id, 'checked', !todo.checked)
                }
                disabled={todo.removed}
                checked={todo.checked}
              />
              <Button
                title={todo.removed ? '復元' : '削除'}
                propsOnClick={() =>
                  handleTodo(todo.id, 'removed', !todo.removed)
                }
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};
// jsxは必ず単一の要素でreturnさせる
