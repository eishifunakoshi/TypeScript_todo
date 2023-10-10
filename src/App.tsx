import { useState } from 'react';

type Todo = {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
};

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
        // new Dateで日付と時刻を表し、
        // .getTimeでm秒単位で取得することで異なるIDを取得
      };

      setTodos((todos) => [...todos, newTodo]);
      setText('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  // React.ChangeEvent<HTMLInputElement>はReactコンポーネント内で
  // フォーム要素の値が変更されたときに、その変更イベントに関連する型情報を提供する

  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };

  // const handleEdit = (id: number, value: string) => {
  //   setTodos((todos) => {
  //     const newTodos = todos.map((todo) => {
  //       if (todo.id === id) {
  //         return { ...todo, value: value };
  //       }
  //       return todo;
  //     });
  //     return newTodos;
  //   });
  // };
  //     const newTodo = todos.find((todo) => todo.id === id);
  //     if (!newTodo) return todos;
  //     return [...todos, newTodo];
  //   });
  // };

  // const handleCheck = (id: number, checked: boolean) => {
  //   setTodos((todos) => {
  //     const newTodos = todos.map((todo) => {
  //       if (todo.id === id) {
  //         return { ...todo, checked };
  //       }
  //       return todo;
  //     });
  //     return newTodos;
  //   });
  // };

  // const handleRemove = (id: number, removed: boolean) => {
  //   setTodos((todos) => {
  //     const newTodo = todos.map((todo) => {
  //       if (todo.id === id) {
  //         return { ...todo, removed };
  //       }
  //       return todo;
  //     });
  //     return newTodo;
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
        <button
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        filter !== 'checked' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input type="text" value={text} onChange={(e) => handleChange(e)} />
            <input type="submit" value="追加" onSubmit={handleSubmit} />
          </form>
        )
      )}

      <ol>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleTodo(todo.id, 'value', e.target.value)}
              />
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleTodo(todo.id, 'checked', !todo.checked)}
              />
              <button
                onClick={() => handleTodo(todo.id, 'removed', !todo.removed)}
              >
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
// jsxは必ず単一の要素でreturnさせる
