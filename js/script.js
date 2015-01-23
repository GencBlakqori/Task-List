(function($){
	var Tasks = {
		init :function(config){
			var self = this;
			self.config = config;
			self.taskListObject = {"id":"","active":"","task_title": "","tasks":[] };
			self.taskObject = {"id":"", "title":"","description":"", "isDone": false};
			$.post('load.php', function(data){
				self.tasksContainer = JSON.parse(data); 
			}).done(function(){
				self.writteToPage();
				self.eventHandler();
				self.config.formContainer.hide();
				self.config.mainContainer.find('.panel-body').hide();
				$.material.init();	
			});
		},

		eventHandler: function(){
			var self = Tasks;
			self.config.taskListButton.on('click',function(){self.config.formContainer.slideToggle();});
			self.config.addTaskListButton.on('click', self.createTaskList);
			self.config.mainContainer.on('click','.edit', self.editTask);
			self.config.mainContainer.on('click', '.add-task', self.addTask);
			self.config.mainContainer.on('click', '.save-task', self.saveEditedTask);
			self.config.mainContainer.on('click', '.cancle-edit', self.cancleEdit);
			self.config.mainContainer.on('click','.delete-tasklist',self.removeTaskList);
			self.config.mainContainer.on('click','.delete-task', self.removeTask);
			self.config.mainContainer.on('click','.panel-title', self.slideTogglePanel);
			self.config.mainContainer.on('change','.checkbox', self.checkIt);
		},

		checkIt: function(){
			var self = Tasks,
				$this = $(this),
				listId = $this.parents('.task-list').data('id'),
				taskId = $this.data('task_id'),
				value = !$this.parent().data('is_done');
			if(value){
				$this.parent().data('is_done',value).addClass('done').find('.edit').hide();
			}
			else{
				$this.parent().data('is_done',value).removeClass('done').find('.edit').show();
			}
			self.tasksContainer[listId].tasks[taskId].isDone = value;
			self.saveToFile();
			self.setAllStatuses();
		},

		cancleEdit: function(){
			var $this = $(this);
			$this.closest('.task-list').find('.task-container').slideToggle(function(){
				$this.closest('.task-list').find('.task-edit').slideToggle();
			});
		},

		slideTogglePanel: function(){
			$(this).closest('.task-list').find('.panel-body').slideToggle();
		},

		createTaskList: function(){
			var self = Tasks,
				taskTitle = self.config.taskTitleInput.val(),
				task = self.config.taskInput.val(),
				taskDescription = self.config.taskDescriptionInput.val();
			self.config.taskTitleInput.val('');
			self.config.taskInput.val('');
			self.config.taskDescriptionInput.val('');
			self.config.formContainer.hide();
			self.addTaskList(self.taskListObject, taskTitle);
			self.addTaskToTaskList(self.taskObject, self.tasksContainer.length-1, task, taskDescription);
			self.writteToPage();
		},

		addTask: function(){
			var parentDiv = $(this).closest(".task-list"),
				self = Tasks,
				task = parentDiv.find('.task-container').find('.task-container-task').val(),
				taskDescription = parentDiv.find('.task-container').find('.task-container-description').val();
			parentDiv.find('.task-container').find('.task-container-task').val('');
			parentDiv.find('.task-container').find('.task-container-description').val('');
			var index = parseInt(parentDiv.data('id'));
			self.addTaskToTaskList(self.taskObject, index, task, taskDescription);
			self.writteToPage();
		},

		editTask: function(){
			var $this = $(this),
				parentDiv = $this.closest(".task-list"),
				self = Tasks,
				taskID = parseInt($this.closest('li').data('task_id')),
				taskListID = parseInt($this.closest('.task-list').data('id')),
				i=0;
			parentDiv.find('.task-edit').find('.task-container-task').val(self.tasksContainer[taskListID].tasks[taskID].title),
			parentDiv.find('.task-edit').find('.task-container-description').val(self.tasksContainer[taskListID].tasks[taskID].description);
			parentDiv.find('.task-edit').find('.save-task').data('id' ,taskID);
			$this.closest('.task-list').find('.task-container').slideToggle(function(){
				$this.closest('.task-list').find('.task-edit').slideToggle();
			});
		},

		saveEditedTask: function(){
			var $this = $(this),
				parentDiv = $this.closest(".task-list"),
				self = Tasks,
				task = parentDiv.find('.task-edit').find('.task-container-task').val(),
				taskDescription = parentDiv.find('.task-edit').find('.task-container-description').val();
			parentDiv.find('.task-edit').find('.task-container-task').val('');
			parentDiv.find('.task-edit').find('.task-container-description').val('');
			var index = parseInt(parentDiv.data('id')),
				taskID = parseInt($this.data('id'));
			self.removeAllActiveClasses();
			self.tasksContainer[index].active="active";
			self.tasksContainer[index].tasks[taskID].title=task;
			self.tasksContainer[index].tasks[taskID].description=taskDescription;
			self.writteToPage();
		},

		removeTask: function(){
			var confirm = window.confirm('Do you really want to delete the task ?'),
				$this = $(this);
			if(confirm){
				var taskID = parseInt($this.closest('li').data('task_id')),
					taskListID = parseInt($this.closest('.task-list').data('id')),
					self = Tasks;
				self.tasksContainer[taskListID].tasks.splice(taskID,1);
				self.removeAllActiveClasses();
				self.tasksContainer[taskListID].active="active";
				for(var i=taskID;i<self.tasksContainer[taskListID].tasks.length ;i++){
					self.tasksContainer[taskListID].tasks[i].id=i;
				}
				self.writteToPage();
			}
		},

		addTaskList :function(tlo, tt){
			var self = Tasks,
				tlObject = (JSON.parse(JSON.stringify(tlo)));
			tlObject.id = self.tasksContainer.length +"";
			tlObject.task_title = tt;
			self.tasksContainer.push(tlObject);
		},

		addTaskToTaskList :function(tObject, taskListIndex, taskObjectTitle, taskObjectDescription){
			var self = Tasks,
				taskObject = (JSON.parse(JSON.stringify(tObject)));
			self.removeAllActiveClasses();
			self.tasksContainer[taskListIndex].active="active";
			taskObject.id = self.tasksContainer[taskListIndex].tasks.length;
			taskObject.title = taskObjectTitle;
			taskObject.description = taskObjectDescription;
			self.tasksContainer[taskListIndex].tasks.push(taskObject);
		},

		removeTaskList : function(){
			var self = Tasks,
				confirm = window.confirm("Do you really want to delete the task list ?");
			if(confirm){
				var index = parseInt($(this).closest('.task-list').data('id'));
				self.tasksContainer.splice(index,1);
				for(var i=index;i<self.tasksContainer.length;i++){
					self.tasksContainer[i].id=i;
				}
				self.writteToPage();		
			}
		},

		setAllStatuses : function(){
			var self = Tasks;
			$('.task-list').each(function(e, s){
				var listID = $(this).data('id'),
					count = 0;
				for(var i=0, len = self.tasksContainer[listID].tasks.length; i<len; i++){
					if(self.tasksContainer[listID].tasks[i].isDone===true){
						count++;
					}
				}
				$(this).find('.panel-title').text(self.tasksContainer[listID].task_title +' - ' + count + '/'+self.tasksContainer[listID].tasks.length +' done');
			});
		},

		saveToFile: function(){
			var self = Tasks;
			$.post('save.php',{'content':JSON.stringify(self.tasksContainer)});
		},

		writteToPage :function(){
			var self = Tasks;
			var template = Handlebars.compile(self.config.taskForm.html()),
				self = Tasks,
				temp = template(self.tasksContainer);
			self.config.mainContainer.empty().append(temp);
			self.saveToFile();
			self.setAllStatuses();
		},

		removeAllActiveClasses: function(){
			var self = Tasks;
			for(var i = 0; i<self.tasksContainer.length;i++)
			{
				self.tasksContainer[i].active="";
			}
		}
	};
		
	Tasks.init({
		taskForm : $('#tasks'),
		formContainer : $('.form-container'),
		taskTitleInput : $('#task-title'),
		taskInput : $('#task'),
		taskDescriptionInput : $('#task-description'),
		mainContainer : $('.task-list-container'),
		taskListButton : $('.task-list-button'),
		addTaskListButton : $('.add-task-list'),
		checkTask : $('.checkbox')
	});
})(jQuery);