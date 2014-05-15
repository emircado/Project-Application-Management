<div id="app-servers-list-modal" class="dialog-box module" style="display:none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <div class="dialog-header-block">
                <h3>Servers</h3>
                <a id="app-servers-list-modal-close-button" href="#" class="close-dialog" title="Close"><span class="icon"></span></a>
            </div>
            <form>
                <div class="contact-info-details">
                    <!-- body -->
                    <div id="edit-primary-content" class="content" style="padding:10px;">
                        <table>
                            <thead>
                                <tr>                      
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Network</th>
                                    <th>Public IP</th>
                                    <th>Private IP</th>
                                    <th>Action</th>
                                </tr>
                                <tr>
                                    <th><input id="app-servers-list-modal-name" type="text"/></th>
                                    <th></th>
                                    <th><input id="app-servers-list-modal-network" type="text"/></th>
                                    <th><input id="app-servers-list-modal-public" type="text"/></th>
                                    <th><input id="app-servers-list-modal-private" type="text"/></th>
                                    <th><div><button id="search-submit">Search</button></div><a id="app-servers-list-modal-clear" href="#">Clear</a></th>
                                </tr>
                            </thead>
                            <tbody id="app-servers-list-modal-table">
                                <tr>    
                                    <td>Server 1</td>
                                    <td>PRODUCTION</td>
                                    <td>Network 1</td>
                                    <td>255.255.255.255</td>
                                    <td>255.255.255.255</td>
                                    <td><a id="app-servers-select_1" href="#">Select</a></td>
                                </tr>
                                <tr>    
                                    <td>Server 2</td>
                                    <td>PRODUCTION</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><a id="app-servers-select_create" href="#">Create</a></td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="page-nav">
                            <div class="page-count">
                                <span class="current-page" id="app-servers-list-modal-part"></span>
                                <span class="all-page" id="app-servers-list-modal-total"></span>
                            </div>
                            <div class="page-nav-arrow">
                                <a id="app-servers-list-modal-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                                <a id="app-servers-list-modal-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>