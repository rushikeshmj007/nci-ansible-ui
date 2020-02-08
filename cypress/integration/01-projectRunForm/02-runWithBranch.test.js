describe('Project run form run in general', () => {
	it('should be loaded by url', () => {
		cy.visitPage('projectRunForm');
	});

	const runProjectParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	it('select project, branch, playbook, inventories', () => {
		cy.fillProjectRunForm(runProjectParams);
	});

	it('click on run button', () => {
		cy.get('button:contains(Run):not(.disabled)').click();
	});

	it('should redirect to build page', () => {
		cy.expectBeOnPage('build');
	});

	it('build page should contain info according to created build', () => {
		cy.getBuildIdFromCurrentUrl()
			.then((buildId) => 	{
				return cy.request(`/api/0.1/builds/${buildId}`, {json: true});
			})
			.should((response) => {
				expect(response).an('object');
				expect(response).have.any.key('body');
				expect(response.body).an('object');
				expect(response.body).have.any.key('build');
				cy.expectApiBuild({
					build: response.body.build,
					expectedParams: runProjectParams
				});
			});
	});
});
