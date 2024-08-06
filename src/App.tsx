import data from "./data.json";

console.log(data);

function App() {
  return (
    <main className="flex flex-col p-4 gap-8 max-w-[1280px] mx-auto">
      <h1 className="text-4xl font-bold">Hello Frontend!</h1>
      {data?.projects.map((project) => {
        return (
          <div
            key={project?.id}
            className="border-gray-400 border-2 p-4 rounded-xl"
          >
            <h1 className="font-bold text-2xl">{project?.name}</h1>
            <p>{project.description}</p>

            <div className="mt-4">
              {project.tasks.map((task, index) => {
                return (
                  <div
                    key={task?.id}
                    className="mt-4, border-blue-500 border-2 p-4 mb-4 rounded-md"
                  >
                    <p className="text-sm">
                      {index + 1}. {task.title}
                    </p>
                    <p className="text-sm">{task?.status}</p>

                    <div className="mt-4">
                      {task.subtasks.map((subtask) => {
                        return (
                          <div key={subtask?.id}>
                            <p className="text-sm">{subtask.title}</p>
                            <p className="text-sm">{subtask?.status}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default App;
