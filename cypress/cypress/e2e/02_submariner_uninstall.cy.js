/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2022 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

import { clusterSetMethods } from '../views/clusterset/clusterset'

describe('submariner - uninstall validation', {
    tags: ['@submariner', '@e2e'],
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, function () {
    before(function () {
        cy.setAPIToken()
        cy.clearOCMCookies()
        cy.login()
        
    })

    it('test the Uninstall Submariner add-ons', { tags: ['uninstall'] }, function () {
        let clusterSetName = Cypress.env('CLUSTERSET')
        // verify that a cluster set with deployment of submariner is exists.
        clusterSetMethods.clusterSetShouldExist(clusterSetName)
        cy.get('[data-label=Name]').contains(clusterSetName).then($value => {
            length = $value.length

            if (length != 1) this.skip()
            else {
                cy.get('[data-label=Name]').eq(1).click(15, 30)
                cy.get('.pf-c-nav__link').contains('Submariner add-ons').click()

                cy.get('.pf-c-table__check > input').click({multiple: true}).should('be.checked')
                cy.get('#toggle-id').click()
                cy.get('.pf-c-dropdown__menu-item').should('be.visible').click()
                cy.get('.pf-c-form__actions > .pf-m-primary').click()

                // Submariner uninstall process requires deletion of resource on the cloud,
                // where the actual resources exist.
                // Resource deletion may take time and from the UI testing we are unable to
                // fetch the deletion state.
                // Some of the clouds may take more time to delete the resource.
                // Set the final timeout to 5 minutes.
                // If the resources still exist after the timeout, fail the test.
                cy.get('[data-label="Cluster"]', {timeout: 300000}).should('not.exist')
            }
        })
    }) 
})

