<!-- LIST APPLICATIONS -->
<div id="applications-list">
    <form>
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Applications</b></h3>&nbsp&nbsp
                    <a id="applications-button-add" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <table>
                    <thead>
                        <tr>                      
                            <th width=''>Name</th>
                            <th width=''>Type</th>
                            <th width=''>R<?php echo htmlentities("&"); ?>D Point Person</th>
                            <th width=''>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="applications-table">
                        <tr>
                            <td>App 1</td>
                            <td>Type 1</td>
                            <td>someuser1</td>
                            <td>View</td>
                        </tr>
                        <tr>
                            <td>App 2</td>
                            <td>Type 2</td>
                            <td>someuser2</td>
                            <td>View</td>
                        </tr>
                        <tr>
                            <td>App 3</td>
                            <td>Type 3</td>
                            <td>someuser3</td>
                            <td>View</td>
                        </tr>
                        <tr>
                            <td>App 4</td>
                            <td>Type 4</td>
                            <td>someuser4</td>
                            <td>View</td>
                        </tr>
                        <tr>
                            <td>App 5</td>
                            <td>Type 5</td>
                            <td>someuser5</td>
                            <td>View</td>
                        </tr>
                    </tbody>
                </table>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="applications-part"></span>
                        <span class="all-page" id="applications-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="applications-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="applications-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>