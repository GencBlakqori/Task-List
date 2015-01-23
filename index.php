<?php include '_partials/header.php'; ?>
<div class="container">	
	<h1 class="main-title">My tasks</h1>
	<div class="task-list-container">
	
	<script id="tasks" type="text/x-handlebars-template">
			{{#each this}}
			<div class="task-list panel panel-primary" data-id={{id}}>
				<h2 class="panel-title panel-heading">{{task_title}}</h2>
				<span class="delete delete-tasklist"><img src="img/tasklistdelete.png"></span>
				<div class="panel-body {{active}}">
					<ul>
						{{#each tasks}}
						{{#if this.isDone }}
							<li class="list-group-item done" data-task_id={{this.id}} data-is_done="true">
							<span class="edit" style="display:none"><img src="img/edittask.png"></span>
							<input type="checkbox" class="checkbox" data-task_id={{this.id}} checked="checked">
						{{else}}
							<li class="list-group-item" data-task_id={{this.id}} data-is_done="false">
							<span class="edit"><img src="img/edittask.png"></span>
							<input type="checkbox" class="checkbox" data-task_id={{this.id}}>
						{{/if}}
							<p><strong>To do</strong> : {{this.title}}</p>
							<p><strong>Description</strong> : {{this.description}}</p>
							<span class="delete delete-task"><img src="img/taskdelete.png"></span>
							
						</li>
						{{/each}}
					</ul>
					<div class="task-container">
						<label for="task">Add Task : </label>
						<input class="task-container-task form-control" type="text">
						<label for="task-description">Add Description : </label>
						<input class="task-container-description form-control" type="text">
						<button class="add-task btn btn-primary">Add</button>
					</div>
					<div class="task-edit">
						<label for="task">Task Name : </label>
						<input class="task-container-task form-control" type="text">
						<label for="task-description">Description : </label>
						<input class="task-container-description form-control" type="text">
						<button class="save-task btn btn-primary" data-id="">Save</button>
						<button class="cancle-edit btn btn-primary">Cancle</button>
					</div>
				</div>
			</div>	
			{{/each}}

	</script>
		
	</div>
	<div class="form-container panel-body">
		<div><label for="task-title">Task Title : </label>
		<input id="task-title" class="form-control" name="task-tittle" type="text"></div>
		<div><label for="task">Enter the task : </label>
		<input id="task" class="form-control" type="text"></div>
		<div><label for="task-description">Description : </label>
		<input class="form-control" id="task-description" type="text"></div>
		
		
		
		<button class="add-task-list btn btn-primary">Add</button>
	</div>
	<button class="task-list-button btn btn-primary ">Create TaskList</button>
</div>
<?php include '_partials/footer.php'; ?>